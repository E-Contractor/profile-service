import axios from 'axios';

const baseURL = process.env.BID_SERVICE_URL || 'http://localhost:3004';

const makeRequest = async (method: string, endpoint: string, data?: any) => {
  try {
    const response = await axios({
      method,
      url: `${baseURL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'x-service-auth': process.env.SERVICE_AUTH_SECRET,
      },
      timeout: 5000,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Bid service API error for ${method} ${endpoint}:`, error.response?.data || error.message);
    throw new Error(`Bid service communication failed: ${error.response?.data?.message || error.message}`);
  }
};

const getBidById = async (id: string) => {
  return makeRequest('GET', `/api/bid/user/${id}`);
}

export const BidServiceClient = {
  getBidByUser: getBidById
}