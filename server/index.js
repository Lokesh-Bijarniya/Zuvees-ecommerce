const mongoose = require('mongoose');
const app = require('./app'); // import the app
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zuvee-ecommerce';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.RIDER_URL],
    credentials: true
  }
});

// Attach io to app for use in controllers
app.set('io', io);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  // Example: join rooms, listen for events, etc.
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(`order_${orderId}`);
  });
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
