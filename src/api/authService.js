import axiosInstance from './axiosInstance';
import API_ENDPOINTS from './endpoints';

/**
 * 
 * @param {{ email, password }} credentials
 */
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
};

/**
 * 
 * @param {{ name, email, password, role }} userData
 */
export const registerUser = async (userData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  return response.data;
};

/**
 * 
 */
export const fetchCurrentUser = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * 
 */
export const logoutUser = async () => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data;
};

/**
 * 
 * @param {string} oauthToken
 */
export const verifyGoogleToken = async (oauthToken) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.GOOGLE_TOKEN,
    {},
    {
      headers: { Authorization: `Bearer ${oauthToken}` },
    }
  );
  return response.data;
};
