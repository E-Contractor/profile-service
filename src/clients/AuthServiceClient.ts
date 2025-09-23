import axios from 'axios';

const baseURL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

const makeRequest = async (method: string, endpoint: string, data?: any) => {
  try {
    const response = await axios({
      method,
      url: `${baseURL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Auth': process.env.SERVICE_AUTH_SECRET,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Auth service API error for ${method} ${endpoint}:`, error.response?.data || error.message);
    throw new Error(`Auth service communication failed: ${error.response?.data?.message || error.message}`);
  }
};

const validateUser = async (userId: string) => {
  return makeRequest('GET', `/api/users/${userId}/validate`);
};

const getUserInfo = async (userId: string) => {
  return makeRequest('GET', `/api/users/${userId}`);
};

export const AuthServiceClient = {
  validateUser,
  getUserInfo,
};
