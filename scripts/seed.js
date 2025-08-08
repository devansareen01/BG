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

// Function to clear all schemas and recreate them
const clearAndRecreateSchemas = async () => {
  console.log('🔄 Clearing and recreating schemas...');
  
  // Delete existing models to clear any cached schemas
  delete mongoose.models.User;
  delete mongoose.models.Product;
  
  // Recreate models with fresh schemas
  const User = mongoose.model('User', userSchema);
  const Product = mongoose.model('Product', productSchema);
  
  console.log('✅ Schemas recreated successfully');
  return { User, Product };
};

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

    // Clear ALL existing data and collections
    console.log('🧹 Clearing all existing data and collections...');
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    
    console.log(`📋 Found collections: ${collectionNames.join(', ')}`);
    
    // Drop all collections except system collections
    for (const collectionName of collectionNames) {
      if (!collectionName.startsWith('system.')) {
        await mongoose.connection.db.dropCollection(collectionName);
        console.log(`🗑️ Dropped collection: ${collectionName}`);
      }
    }
    
    // Clear existing data from our models (in case they exist)
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared existing data from models');

    // Clear and recreate schemas for a completely clean state
    const { User: FreshUser, Product: FreshProduct } = await clearAndRecreateSchemas();

    // Seed Users
    const users = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' }
    ];

    await FreshUser.insertMany(users);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed Products
    const products = [
      { name: 'Laptop', price: 999.99, description: 'High-performance laptop' },
      { name: 'Mouse', price: 29.99, description: 'Wireless mouse' },
      { name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard' }
    ];

    await FreshProduct.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Verify data
    const userCount = await FreshUser.countDocuments();
    const productCount = await FreshProduct.countDocuments();
    
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
