import axiosInstance from './axiosInstance';
import API_ENDPOINTS from './endpoints';


export const fetchFavorites = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.FAVORITES.LIST);
  return response.data?.data || response.data || [];
};


export const addFavorite = async (propertyId) => {
  const response = await axiosInstance.post(API_ENDPOINTS.FAVORITES.ADD, { propertyId });
  return response.data;
};


export const removeFavorite = async (propertyId) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.FAVORITES.REMOVE(propertyId));
  return response.data;
};
