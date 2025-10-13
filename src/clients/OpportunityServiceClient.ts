import axios from 'axios';

const baseURL = process.env.OPPORTUNITY_SERVICE_URL || 'http://localhost:3003';

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
    console.error(`Opportunity service API error for ${method} ${endpoint}:`, error.response?.data || error.message);
    throw new Error(`Opportunity service communication failed: ${error.response?.data?.message || error.message}`);
  }
};

const getOpportunityByUser = async (userId: string) => {
  return makeRequest('GET', `/api/opportunities/user/${userId}`);
}

export const OpportunityServiceClient = {
  getOpportunityByUser
};
