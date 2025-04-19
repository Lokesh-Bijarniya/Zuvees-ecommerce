jest.setTimeout(30000);

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');

describe('Products API', () => {
  beforeAll(async () => {
    const testUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/zuvee-ecommerce-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testUri, {
        // useNewUrlParser and useUnifiedTopology are not needed with Mongoose 6+
      });
    }
  });

  beforeEach(async () => {
    // Seed the DB with a sample product
    await Product.create({
      name: 'Test Fan',
      description: 'A test fan product',
      category: 'fan',
      basePrice: 1000,
      brand: 'TestBrand',
      images: [],
      variants: [
        {
          color: { name: 'White', code: '#FFFFFF' },
          size: 'Medium',
          price: 1000,
          stock: 10,
          sku: 'FAN-MED-WHT'
        }
      ],
      ratings: { average: 0, count: 0 },
      reviews: []
    });
  });

  afterEach(async () => {
    // Clean up products after each test
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 and a list of products', async () => {
    const res = await request(app).get('/api/products');
    // Log response for debugging
    console.log('PRODUCTS RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].name).toBe('Test Fan');
  });
});
