// Final test to verify course loading
import axios from 'axios';

const testCoursesDetailed = async () => {
  const config = {
    baseURL: 'http://46.202.131.108:8080/api',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const testInstance = axios.create(config);

  try {
    console.log('🔍 Testing courses endpoint with pagination...');
    const response = await testInstance.get('/courses', {
      params: { page: 1, page_size: 12 }
    });
    
    console.log('✅ Success!');
    console.log('Status:', response.status);
    console.log('Data structure:', {
      hasResults: !!response.data.results,
      resultCount: response.data.results?.length || 0,
      totalResult: response.data.pagination?.totalResult || 0,
      pagination: response.data.pagination
    });

    if (response.data.results?.length > 0) {
      console.log('📚 First course:', {
        id: response.data.results[0].id,
        title: response.data.results[0].title || 'No title',
        price: response.data.results[0].price || 'No price',
        instructor: response.data.results[0].user?.name || 'No instructor name'
      });
    }

    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
    return null;
  }
};

testCoursesDetailed();
