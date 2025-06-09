// ApiTest.js
import axiosInstance from "../../axiosConfig/axiosInstance";

/**
 * Utility function to test API connectivity and diagnose issues
 */
export const testApiConnection = async () => {
  try {
    console.log('API Connection Test');
    console.log('==================');
    console.log('API URL:', axiosInstance.defaults.baseURL);
    
    // Test if we can make an OPTIONS request to the API
    const optionsResult = await axiosInstance({
      method: 'OPTIONS',
      url: '/',
      timeout: 5000,
    }).catch(error => {
      return { error };
    });

    if (optionsResult.error) {
      console.error('OPTIONS request failed:', optionsResult.error.message);
      console.log('Error details:', optionsResult.error.response || 'No response');
      return {
        success: false,
        message: 'API is unreachable. Check network connection and API server status.',
        error: optionsResult.error
      };
    }
    
    // Test a simple GET request to check connectivity
    const coursesResult = await axiosInstance.get('/courses/').catch(error => {
      return { error };
    });
    
    if (coursesResult.error) {
      console.error('GET request failed:', coursesResult.error.message);
      console.log('Error status:', coursesResult.error.response?.status);
      console.log('Error details:', coursesResult.error.response?.data || 'No response data');
      return {
        success: false,
        message: 'Cannot fetch courses. API may be reachable but returning errors.',
        error: coursesResult.error
      };
    }
    
    // Success case
    console.log('API connection test successful!');
    console.log('Courses response status:', coursesResult?.status || 'Unknown');
    console.log('Received data:', coursesResult?.data ? 'Yes' : 'No');
    
    return {
      success: true,
      message: 'API is reachable and returning data successfully.',
      coursesCount: coursesResult?.data?.count || 0
    };
  } catch (error) {
    console.error('API test failed with exception:', error);
    return {
      success: false,
      message: 'Unexpected error during API test.',
      error
    };
  }
};

/**
 * Run the API test automatically once when this module is imported
 * Remove this in production if not needed
 */
setTimeout(() => {
  console.log('Running automatic API connection test...');
  testApiConnection();
}, 2000);

export default testApiConnection;
