const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const ApprovedEmail = require('../models/ApprovedEmail');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Add your email with admin role
const addEmail = async () => {
  try {
    // Replace with your email
    const yourEmail = 'lkbijarniya2@gmail.com';
    
    // Check if email already exists
    const existingEmail = await ApprovedEmail.findOne({ email: yourEmail });
    
    if (existingEmail) {
      console.log(`Email ${yourEmail} already exists with role: ${existingEmail.role}`.yellow);
      
      // Update role to admin if it's not already
      if (existingEmail.role !== 'admin') {
        await ApprovedEmail.findOneAndUpdate(
          { email: yourEmail },
          { role: 'admin' }
        );
        console.log(`Updated ${yourEmail} role to admin`.green);
      }
    } else {
      // Create new approved email with admin role
      await ApprovedEmail.create({
        email: yourEmail,
        role: 'admin'
      });
      console.log(`Added ${yourEmail} as admin`.green);
    }
    
    process.exit();
  } catch (err) {
    console.error(`${err}`.red);
    process.exit(1);
  }
};

addEmail();
