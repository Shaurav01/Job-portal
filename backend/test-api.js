const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test function
async function testAPI() {
  console.log('🧪 Testing Job Portal API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test job categories
    console.log('\n2. Testing job categories...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/jobs/categories`);
    console.log('✅ Job categories:', categoriesResponse.data.data);

    // Test featured jobs
    console.log('\n3. Testing featured jobs...');
    const featuredResponse = await axios.get(`${API_BASE_URL}/jobs/featured`);
    console.log('✅ Featured jobs count:', featuredResponse.data.data.length);

    // Test all jobs
    console.log('\n4. Testing all jobs...');
    const jobsResponse = await axios.get(`${API_BASE_URL}/jobs?limit=5`);
    console.log('✅ Jobs found:', jobsResponse.data.data.length);
    console.log('✅ Total jobs:', jobsResponse.data.pagination.total);

    console.log('\n🎉 All API tests passed! Backend is working correctly.');

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. Make sure the backend server is running on port 5000.');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
