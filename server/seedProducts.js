require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const cloudinary = require('./utils/cloudinary');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zuvee';

// Example product seed data (customize as needed)
const products = [
  {
    name: 'SuperCool Fan',
    brand: 'CoolBreeze',
    category: 'fan',
    basePrice: 1999,
    description: 'A powerful, energy-efficient fan.',
    features: ['Silent operation', 'Remote control', '5-speed settings'],
    specifications: { Power: '50W', Color: 'White', Warranty: '2 years' },
    variants: [
      { size: 'Standard', color: { name: 'White', code: '#FFFFFF' }, price: 1999, stock: 50, sku: 'FAN-WHT-STD' },
      { size: 'Large', color: { name: 'Black', code: '#000000' }, price: 2199, stock: 30, sku: 'FAN-BLK-LRG' }
    ],
    localImages: [path.join(__dirname, 'uploads/fan1.jpg')]
  },
  {
    name: 'ChillMaster AC',
    brand: 'ChillPro',
    category: 'ac',
    basePrice: 29999,
    description: 'High-efficiency air conditioner with fast cooling.',
    features: ['Inverter technology', 'WiFi enabled', 'Auto-clean'],
    specifications: { Power: '1.5 Ton', Color: 'Silver', Warranty: '3 years' },
    variants: [
      { size: '1 Ton', color: { name: 'Silver', code: '#C0C0C0' }, price: 27999, stock: 15, sku: 'AC-SLV-1T' },
      { size: '1.5 Ton', color: { name: 'White', code: '#FFFFFF' }, price: 29999, stock: 20, sku: 'AC-WHT-15T' }
    ],
    localImages: [path.join(__dirname, 'uploads/ac1.jpg'), path.join(__dirname, 'uploads/ac2.jpg')]
  }
  // Add more products as needed
];

async function uploadImagesToCloudinary(imagePaths) {
  const urls = [];
  for (const imgPath of imagePaths) {
    if (fs.existsSync(imgPath)) {
      const result = await cloudinary.uploader.upload(imgPath, {
        folder: 'zuvee-products',
      });
      urls.push(result.secure_url);
    } else {
      console.warn(`File not found: ${imgPath}`);
    }
  }
  return urls;
}

async function seedProducts() {
  await mongoose.connect(MONGO_URI);
  await Product.deleteMany({}); // Delete old products
  for (const prod of products) {
    let imageUrls = [];
    if (prod.localImages && prod.localImages.length > 0) {
      imageUrls = await uploadImagesToCloudinary(prod.localImages);
    }
    const { localImages, ...prodData } = prod;
    prodData.images = imageUrls;
    await Product.create(prodData);
  }
  console.log('Seeded products with Cloudinary images!');
  await mongoose.disconnect();
}

seedProducts().catch(e => {
  console.error(e);
  process.exit(1);
});
