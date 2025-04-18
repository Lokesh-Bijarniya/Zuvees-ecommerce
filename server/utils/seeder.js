const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const cloudinary = require('./cloudinary');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Sample products data
const products = [
  // --- FANS ---
  {
    name: 'Premium Ceiling Fan',
    brand: 'Bajaj',
    description: 'High-performance ceiling fan with energy-efficient motor and remote control.',
    category: 'fan',
    basePrice: 149.99,
    images: ['fan1.jpg'],
    features: [ 'Energy efficient', 'Remote control', 'Silent operation', 'Modern design' ],
    specifications: { Power: '50W', RPM: '350', Sweep: '1200mm', Warranty: '2 years' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: 'Small (36")', price: 149.99, stock: 25, sku: 'CF-WHT-36' },
      { color: { name: 'White', code: '#FFFFFF' }, size: 'Medium (48")', price: 179.99, stock: 20, sku: 'CF-WHT-48' },
      { color: { name: 'White', code: '#FFFFFF' }, size: 'Large (56")', price: 199.99, stock: 15, sku: 'CF-WHT-56' }
    ],
    reviews: [
      { name: 'Amit Sharma', rating: 5, comment: 'Excellent fan, very quiet and efficient!' },
      { name: 'Priya Singh', rating: 4, comment: 'Works well, remote is handy.' }
    ]
  },
  {
    name: 'Classic Wall Fan',
    brand: 'Usha',
    description: 'Oscillating wall fan with adjustable speed and durable build.',
    category: 'fan',
    basePrice: 109.99,
    images: ['fan2.jpg'],
    features: [ 'Adjustable speed', 'Oscillating head', 'Durable motor', 'Wall mountable' ],
    specifications: { Power: '40W', RPM: '1350', Sweep: '400mm', Warranty: '1 year' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: '16 inch', price: 109.99, stock: 30, sku: 'WF-WHT-16' },
      { color: { name: 'Blue', code: '#1E90FF' }, size: '16 inch', price: 109.99, stock: 18, sku: 'WF-BLU-16' }
    ],
    reviews: [
      { name: 'Rahul Verma', rating: 4, comment: 'Good airflow and easy to install.' }
    ]
  },
  {
    name: 'Designer Table Fan',
    brand: 'Orient',
    description: 'Compact table fan with stylish design and quiet operation.',
    category: 'fan',
    basePrice: 89.99,
    images: ['fan3.jpg'],
    features: [ 'Portable', 'Quiet operation', 'Stylish look', 'Easy to clean' ],
    specifications: { Power: '35W', RPM: '1300', Sweep: '300mm', Warranty: '1 year' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: '12 inch', price: 89.99, stock: 22, sku: 'TF-WHT-12' },
      { color: { name: 'Red', code: '#FF0000' }, size: '12 inch', price: 89.99, stock: 12, sku: 'TF-RED-12' }
    ],
    reviews: [
      { name: 'Sonal Gupta', rating: 5, comment: 'Very stylish and portable!' }
    ]
  },
  {
    name: 'Super Saver Pedestal Fan',
    brand: 'Crompton',
    description: 'Energy-saving pedestal fan with adjustable height and powerful airflow.',
    category: 'fan',
    basePrice: 129.99,
    images: ['fan4.jpg'],
    features: [ 'Energy saving', 'Adjustable height', 'Powerful airflow', 'Easy assembly' ],
    specifications: { Power: '55W', RPM: '1350', Sweep: '400mm', Warranty: '2 years' },
    variants: [
      { color: { name: 'Black', code: '#000000' }, size: '16 inch', price: 129.99, stock: 18, sku: 'PF-BLK-16' }
    ],
    reviews: [
      { name: 'Deepak Jain', rating: 4, comment: 'Good value for money.' }
    ]
  },
  {
    name: 'Eco Breeze Tower Fan',
    brand: 'Havells',
    description: 'Slim tower fan with remote and multiple speed settings.',
    category: 'fan',
    basePrice: 139.99,
    images: ['fan1.jpg'],
    features: [ 'Slim design', 'Remote control', 'Multiple speeds', 'Low noise' ],
    specifications: { Power: '45W', RPM: '1200', Sweep: '400mm', Warranty: '2 years' },
    variants: [
      { color: { name: 'Grey', code: '#808080' }, size: '40 inch', price: 139.99, stock: 14, sku: 'TF-GRY-40' }
    ],
    reviews: [
      { name: 'Meena Rathi', rating: 5, comment: 'Perfect for small rooms.' }
    ]
  },
  // --- ACS ---
  {
    name: 'Smart Window AC',
    brand: 'LG',
    description: 'Wi-Fi enabled window air conditioner with smartphone control and energy-saving mode.',
    category: 'ac',
    basePrice: 349.99,
    images: ['ac1.jpg'],
    features: [ 'Wi-Fi enabled', 'Smartphone control', 'Energy-saving mode', 'Remote control' ],
    specifications: { Power: '1500W', Capacity: '1.5 Ton', Type: 'Window', Warranty: '1 year' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: '1 Ton', price: 349.99, stock: 10, sku: 'AC-WIN-WHT-1T' },
      { color: { name: 'White', code: '#FFFFFF' }, size: '1.5 Ton', price: 399.99, stock: 8, sku: 'AC-WIN-WHT-1.5T' }
    ],
    reviews: [
      { name: 'Arun Kumar', rating: 5, comment: 'Smart features are very useful.' },
      { name: 'Nisha Patel', rating: 4, comment: 'Cools the room quickly.' }
    ]
  },
  {
    name: 'Inverter Split AC',
    brand: 'Daikin',
    description: 'High-efficiency inverter split AC with fast cooling and low noise.',
    category: 'ac',
    basePrice: 499.99,
    images: ['ac2.jpg'],
    features: [ 'Inverter technology', 'Fast cooling', 'Low noise', 'Energy efficient' ],
    specifications: { Power: '1200W', Capacity: '1.5 Ton', Type: 'Split', Warranty: '1 year' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: '1 Ton', price: 499.99, stock: 7, sku: 'AC-SPL-WHT-1T' },
      { color: { name: 'White', code: '#FFFFFF' }, size: '2 Ton', price: 599.99, stock: 5, sku: 'AC-SPL-WHT-2T' }
    ],
    reviews: [
      { name: 'Ravi Joshi', rating: 5, comment: 'Very silent and efficient.' },
      { name: 'Sakshi Mehra', rating: 4, comment: 'Fast cooling even in peak summer.' }
    ]
  },
  {
    name: 'Portable AC',
    brand: 'Blue Star',
    description: 'Portable air conditioner with easy installation and mobility.',
    category: 'ac',
    basePrice: 299.99,
    images: ['ac3.jpg'],
    features: [ 'Portable', 'Easy installation', 'Mobility', 'Remote control' ],
    specifications: { Power: '1000W', Capacity: '1 Ton', Type: 'Portable', Warranty: '1 year' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: '1 Ton', price: 299.99, stock: 9, sku: 'AC-PORT-WHT-1T' }
    ],
    reviews: [
      { name: 'Kabir Sethi', rating: 4, comment: 'Easy to move and install.' }
    ]
  },
  {
    name: '5-Star Inverter AC',
    brand: 'Voltas',
    description: 'Energy efficient 5-star inverter split AC with copper condenser.',
    category: 'ac',
    basePrice: 529.99,
    images: ['ac4.jpg'],
    features: [ '5-star rating', 'Copper condenser', 'Turbo cooling', 'Stabilizer free operation' ],
    specifications: { Power: '1400W', Capacity: '1.5 Ton', Type: 'Split', Warranty: '1 year' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: '1.5 Ton', price: 529.99, stock: 6, sku: 'AC-VOLT-1.5T' }
    ],
    reviews: [
      { name: 'Ramesh Kumar', rating: 5, comment: 'Very energy efficient and cools fast.' }
    ]
  },
  {
    name: 'Turbo Cool Window AC',
    brand: 'Hitachi',
    description: 'Window AC with turbo cool technology and low noise operation.',
    category: 'ac',
    basePrice: 389.99,
    images: ['ac5.jpg'],
    features: [ 'Turbo cool', 'Low noise', 'Auto restart', 'Filter clean indicator' ],
    specifications: { Power: '1350W', Capacity: '1.5 Ton', Type: 'Window', Warranty: '1 year' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: '1.5 Ton', price: 389.99, stock: 7, sku: 'AC-HTCH-1.5T' }
    ],
    reviews: [
      { name: 'Anjali Desai', rating: 4, comment: 'Turbo mode is very effective.' }
    ]
  },
  {
    name: 'Smart Tower AC',
    brand: 'Samsung',
    description: 'Smart tower AC with Wi-Fi and advanced air purification.',
    category: 'ac',
    basePrice: 649.99,
    images: ['ac6.jpg'],
    features: [ 'Wi-Fi enabled', 'Air purification', 'Advanced cooling', 'Smart diagnostics' ],
    specifications: { Power: '1600W', Capacity: '2 Ton', Type: 'Tower', Warranty: '1 year' },
    variants: [
      { color: { name: 'White', code: '#FFFFFF' }, size: '2 Ton', price: 649.99, stock: 4, sku: 'AC-SAM-2T' }
    ],
    reviews: [
      { name: 'Vikas Yadav', rating: 5, comment: 'Great for large living rooms!' }
    ]
  }
];

// Sample approved emails
const approvedEmails = [
  {
    email: 'lkbijarniya2@gmail.com',
    role: 'admin'
  },
  {
    email: 'lkb2k04@gmail.com',
    role: 'rider'
  },
  {
    email: 'rider2@example.com',
    role: 'rider'
  },
  {
    email: 'aj1943372@gmail.com',
    role: 'customer'
  }
];

// Sample users
const users = [
  {
    googleId: '123456789',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User',
    role: 'admin'
  },
  {
    googleId: '987654321',
    name: 'Rider One',
    email: 'rider1@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Rider+One',
    role: 'rider',
    phone: '555-123-4567'
  },
  {
    googleId: '456789123',
    name: 'Rider Two',
    email: 'rider2@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Rider+Two',
    role: 'rider',
    phone: '555-987-6543'
  }
];

// Utility to upload images to Cloudinary and return URLs
async function uploadImagesToCloudinary(imagePaths) {
  const urls = [];
  for (const imgPath of imagePaths) {
    let uploadPath = imgPath;
    let tempFile = null;
    try {
      if (imgPath.startsWith('http')) {
        // Download remote image to a temp file
        const response = await axios({
          url: imgPath,
          responseType: 'arraybuffer',
        });
        const ext = path.extname(imgPath).split('?')[0] || '.jpg';
        tempFile = path.join(__dirname, `temp_${Date.now()}${ext}`);
        fs.writeFileSync(tempFile, response.data);
        uploadPath = tempFile;
      }
      if (fs.existsSync(uploadPath)) {
        const result = await cloudinary.uploader.upload(uploadPath, {
          folder: 'zuvee-products',
        });
        urls.push(result.secure_url);
        // Clean up temp file if created
        if (tempFile) {
          fs.unlinkSync(tempFile);
        }
      } else {
        console.warn(`File not found: ${uploadPath}`);
      }
    } catch (err) {
      console.warn(`Failed to process image ${imgPath}: ${err.message}`);
      // Clean up temp file if created
      if (tempFile && fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  }
  return urls;
}

// Import data into DB
async function importData() {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await ApprovedEmail.deleteMany();

    // For each product, handle image upload if local paths are given
    for (const prod of products) {
      let imageUrls = [];
      if (prod.images && prod.images.length > 0) {
        imageUrls = await uploadImagesToCloudinary(prod.images.map(img => {
          // If it's a local file name, resolve path
          if (!img.startsWith('http')) {
            return path.isAbsolute(img) ? img : path.join(__dirname, '../uploads', img);
          }
          return img;
        }));
      }
      prod.images = imageUrls;
      await Product.create(prod);
    }
    await ApprovedEmail.insertMany(approvedEmails);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Delete all data from DB
async function deleteData() {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await ApprovedEmail.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Determine which function to run based on command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import data or -d to delete data');
  process.exit();
}
