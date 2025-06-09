// Simple API Test Script
import axios from 'axios';

const runApiTests = async () => {
  // Test configurations
  const configs = [
    {
      name: 'Development API',
      baseURL: 'http://46.202.131.108:8080/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    },    {
      name: 'Production API (from .env)',
      baseURL: 'https://api.aectraining.com.sa/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    },
    {
      name: 'Production API (Render)',
      baseURL: 'https://aecv1-1.onrender.com/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  ];

  for (const config of configs) {
    console.log(`\n🧪 Testing ${config.name}...`);
    console.log(`📡 Base URL: ${config.baseURL}`);
    
    try {
      // Create axios instance for this test
      const testInstance = axios.create({
        baseURL: config.baseURL,
        timeout: 10000,
        headers: config.headers
      });

      // Test health check
      console.log('🏥 Testing health endpoint...');
      try {
        const healthResponse = await testInstance.get('/health');
        console.log(`✅ Health check: ${healthResponse.status} - ${healthResponse.statusText}`);
      } catch (healthError) {
        console.log(`❌ Health check failed: ${healthError.message}`);
      }      // Test courses endpoint
      console.log('📚 Testing courses endpoint...');
      try {
        const coursesResponse = await testInstance.get('/courses');
        console.log(`✅ Courses: ${coursesResponse.status} - Found ${coursesResponse.data?.data?.length || 0} courses`);
        console.log('📊 Response structure:', {
          hasData: !!coursesResponse.data,
          dataKeys: Object.keys(coursesResponse.data || {}),
          dataType: typeof coursesResponse.data,
          sampleData: JSON.stringify(coursesResponse.data).substring(0, 200) + '...'
        });
        
        if (coursesResponse.data?.data?.length > 0) {
          console.log(`📖 Sample course: ${coursesResponse.data.data[0].title || 'Unknown title'}`);
        }
      } catch (coursesError) {
        console.log(`❌ Courses failed: ${coursesError.message}`);
        if (coursesError.response) {
          console.log(`   Status: ${coursesError.response.status}`);
          console.log(`   Data: ${JSON.stringify(coursesError.response.data)}`);
        }
      }

      // Test categories endpoint
      console.log('🏷️ Testing categories endpoint...');
      try {
        const categoriesResponse = await testInstance.get('/categories');
        console.log(`✅ Categories: ${categoriesResponse.status} - Found ${categoriesResponse.data?.data?.length || 0} categories`);
      } catch (categoriesError) {
        console.log(`❌ Categories failed: ${categoriesError.message}`);
      }

    } catch (error) {
      console.log(`❌ ${config.name} connection failed: ${error.message}`);
    }
  }

  console.log('\n🎯 API Tests Complete!');
};

// Run the tests
runApiTests().catch(console.error);
