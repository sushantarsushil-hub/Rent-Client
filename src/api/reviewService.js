import axiosInstance from './axiosInstance';
import API_ENDPOINTS from './endpoints';


export const fetchPropertyReviews = async (propertyId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.BY_PROPERTY(propertyId));
  return response.data?.data || response.data || [];
};


export const createReview = async (reviewData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REVIEWS.CREATE, reviewData);
  return response.data;
};
