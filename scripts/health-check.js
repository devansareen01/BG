const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const performHealthCheck = async () => {
  try {
    console.log('🏥 Starting health check...');
    
    // Test 1: Server is running
    console.log('🔍 Testing server connectivity...');
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    
    try {
      const response = await axios.get(`${serverUrl}/health`, {
        timeout: 10000
      });
      
      if (response.status === 200) {
        console.log('✅ Server is running and responding');
        console.log('📊 Health status:', response.data);
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Server health check failed:', error.message);
      process.exit(1);
    }

    // Test 2: MongoDB Connection
    console.log('🔍 Testing MongoDB connection...');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blue-green-app';
    
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      if (mongoose.connection.readyState === 1) {
        console.log('✅ MongoDB connection successful');
      } else {
        throw new Error('MongoDB connection failed');
      }
      
      await mongoose.connection.close();
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      process.exit(1);
    }

    // Test 3: Basic API endpoints
    console.log('🔍 Testing API endpoints...');
    try {
      const apiResponse = await axios.get(`${serverUrl}/api/users`, {
        timeout: 5000
      });
      
      if (apiResponse.status === 200) {
        console.log('✅ API endpoints are working');
      } else {
        throw new Error(`API returned status ${apiResponse.status}`);
      }
    } catch (error) {
      console.error('❌ API endpoint test failed:', error.message);
      process.exit(1);
    }

    console.log('🎉 All health checks passed!');
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  }
};

performHealthCheck();
