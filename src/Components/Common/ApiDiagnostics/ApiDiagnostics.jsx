import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, HStack, Badge, Alert, AlertIcon } from '@chakra-ui/react';
import axiosInstance from '../../../axiosConfig/axiosInstance';

const ApiDiagnostics = () => {
  const [results, setResults] = useState({});
  const [isTestingCourses, setIsTestingCourses] = useState(false);
  const [isTestingCategories, setIsTestingCategories] = useState(false);

  const testEndpoint = async (endpoint, setter) => {
    setter(true);
    const testKey = endpoint.replace('/', '');
    
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axiosInstance.get(endpoint);
      
      setResults(prev => ({
        ...prev,
        [testKey]: {
          status: 'success',
          statusCode: response.status,
          data: response.data,
          dataCount: response.data?.data?.length || response.data?.count || 0,
          message: `Success: ${response.status} - ${response.statusText}`
        }
      }));
    } catch (error) {
      console.error(`${endpoint} failed:`, error);
      setResults(prev => ({
        ...prev,
        [testKey]: {
          status: 'error',
          statusCode: error.response?.status || 'Network Error',
          error: error.message,
          details: error.response?.data || 'No response data',
          message: error.response?.data?.message || error.message
        }
      }));
    } finally {
      setter(false);
    }
  };
  const testCourses = () => testEndpoint('/courses', setIsTestingCourses);
  const testCategories = () => testEndpoint('/categories', setIsTestingCategories);

  const testCoursesWithPagination = async () => {
    setIsTestingCourses(true);
    const testKey = 'courses-paginated';
    
    try {
      console.log('Testing /courses with pagination params...');
      const response = await axiosInstance.get('/courses', {
        params: { page: 1, page_size: 12 }
      });
      
      setResults(prev => ({
        ...prev,
        [testKey]: {
          status: 'success',
          statusCode: response.status,
          data: response.data,
          dataCount: response.data?.results?.length || 0,
          totalResults: response.data?.pagination?.totalResult || 0,
          message: `Success: ${response.status} - Found ${response.data?.results?.length || 0} courses (Total: ${response.data?.pagination?.totalResult || 0})`
        }
      }));
    } catch (error) {
      console.error('/courses with pagination failed:', error);
      setResults(prev => ({
        ...prev,
        [testKey]: {
          status: 'error',
          statusCode: error.response?.status || 'Network Error',
          error: error.message,
          details: error.response?.data || 'No response data',
          message: error.response?.data?.message || error.message
        }
      }));
    } finally {
      setIsTestingCourses(false);
    }
  };
  // Auto-test on component mount
  useEffect(() => {
    testCourses();
    testCategories();
    testCoursesWithPagination();
  }, []);

  const renderResult = (key, label) => {
    const result = results[key];
    if (!result) return null;

    return (
      <Box p={4} border="1px" borderRadius="md" borderColor={result.status === 'success' ? 'green.200' : 'red.200'}>
        <HStack justify="space-between" mb={2}>
          <Text fontWeight="bold">{label}</Text>
          <Badge colorScheme={result.status === 'success' ? 'green' : 'red'}>
            {result.statusCode}
          </Badge>
        </HStack>
        
        {result.status === 'success' ? (
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="green.600">✅ {result.message}</Text>
            <Text fontSize="sm">Data Count: {result.dataCount}</Text>
            {result.dataCount > 0 && (
              <Text fontSize="xs" color="gray.600">
                Sample: {JSON.stringify(result.data.data?.[0] || result.data, null, 2).substring(0, 100)}...
              </Text>
            )}
          </VStack>
        ) : (
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="red.600">❌ {result.message}</Text>
            <Text fontSize="xs" color="gray.600">
              Details: {typeof result.details === 'string' ? result.details : JSON.stringify(result.details)}
            </Text>
          </VStack>
        )}
      </Box>
    );
  };

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>🔧 API Diagnostics</Text>
      
      <Alert status="info" mb={4}>
        <AlertIcon />
        Current API URL: {axiosInstance.defaults.baseURL}
      </Alert>

      <VStack spacing={4} align="stretch">        <HStack spacing={4}>
          <Button 
            onClick={testCourses} 
            isLoading={isTestingCourses}
            colorScheme="blue"
            size="sm"
          >
            Test Courses
          </Button>
          <Button 
            onClick={testCoursesWithPagination} 
            isLoading={isTestingCourses}
            colorScheme="purple"
            size="sm"
          >
            Test Courses (Paginated)
          </Button>
          <Button 
            onClick={testCategories} 
            isLoading={isTestingCategories}
            colorScheme="green"
            size="sm"
          >
            Test Categories
          </Button>
        </HStack>

        {renderResult('courses', 'Courses Endpoint')}
        {renderResult('courses-paginated', 'Courses Endpoint (with Pagination)')}
        {renderResult('categories', 'Categories Endpoint')}

        <Box mt={6} p={4} bg="gray.50" borderRadius="md">
          <Text fontWeight="bold" mb={2}>Console Logs</Text>
          <Text fontSize="sm" color="gray.600">
            Check the browser console (F12) for detailed API request/response logs.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ApiDiagnostics;
