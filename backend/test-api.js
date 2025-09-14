const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'https://job-portal-m4na.onrender.com/api';

async function testAPI() {
  console.log('🧪 Testing Job Portal API...\n');

  try {
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    const categoriesResponse = await axios.get(`${API_BASE_URL}/jobs/categories`);
    console.log('✅ Job categories:', categoriesResponse.data.data);

    const featuredResponse = await axios.get(`${API_BASE_URL}/jobs/featured`);
    console.log('✅ Featured jobs count:', featuredResponse.data.data.length);

    const jobsResponse = await axios.get(`${API_BASE_URL}/jobs?limit=5`);
    console.log('✅ Jobs found:', jobsResponse.data.data.length);
    console.log('✅ Total jobs:', jobsResponse.data.pagination.total);

    console.log('\n🎉 All API tests passed! Backend is working correctly.');

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. Make sure the backend server is running.');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
