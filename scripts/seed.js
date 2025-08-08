const mongoose = require('mongoose');
require('dotenv').config();

// Sample User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});
// User model
const User = mongoose.model('User', userSchema);

// Sample Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blue-green-app';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Seed Users
    const users = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' }
    ];

    await User.insertMany(users);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed Products
    const products = [
      { name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
      { name: 'Mouse', price: 29.99, description: 'Wireless mouse' },
      { name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard' }
    ];

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Verify data
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    console.log(`📊 Database seeded successfully!`);
    console.log(`👥 Users: ${userCount}`);
    console.log(`🛍️ Products: ${productCount}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
