import axios from 'axios';

const baseURL = process.env.AUTH_SERVICE_URL || 'http://lcoalhost:3001';

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
    console.error(`Auth service API error: ${error.message}`);
    throw new Error(`Auth service communication failed: ${error.message}`);
  }
};

const validateUser = async (userId: string) => {
  return makeRequest('GET', `/auth/users/${userId}/validate`);
};

const getUserInfo = async (userId: string) => {
  return makeRequest('GET', `/auth/users/${userId}`);
};

export const AuthServiceClient = {
  validateUser,
  getUserInfo,
};
