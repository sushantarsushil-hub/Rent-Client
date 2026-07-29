import { useQuery } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';


export const normalizeProperty = (prop) => {
  if (!prop) return null;

  const id = prop._id || prop.id;
  const owner = prop.ownerId;
  const host = typeof owner === 'object' && owner !== null
    ? {
        id: owner._id || owner.id || 'owner-id',
        name: owner.name || 'Property Host',
        email: owner.email || '',
        avatar: owner.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        superhost: true,
      }
    : {
        id: 'owner-id',
        name: prop.ownerName || 'Property Host',
        email: prop.ownerEmail || '',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        superhost: true,
      };

  const images = Array.isArray(prop.images) && prop.images.length > 0
    ? prop.images
    : prop.image ? [prop.image] : ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'];

  const rawStatus = (prop.status || 'approved').toLowerCase();
  const statusDisplay = rawStatus === 'approved' ? 'Approved' : (rawStatus === 'rejected' ? 'Rejected' : 'Pending');

  return {
    ...prop,
    id,
    _id: id,
    title: prop.title || 'Untitled Property',
    description: prop.description || '',
    location: prop.location || 'Location Not Specified',
    price: prop.rent !== undefined ? prop.rent : (prop.price || 0),
    rent: prop.rent !== undefined ? prop.rent : (prop.price || 0),
    rentType: prop.rentType || 'Per Night',
    type: prop.propertyType || prop.type || 'Apartment',
    propertyType: prop.propertyType || prop.type || 'Apartment',
    beds: prop.bedrooms !== undefined ? prop.bedrooms : (prop.beds || 1),
    bedrooms: prop.bedrooms !== undefined ? prop.bedrooms : (prop.beds || 1),
    baths: prop.bathrooms !== undefined ? prop.bathrooms : (prop.baths || 1),
    bathrooms: prop.bathrooms !== undefined ? prop.bathrooms : (prop.baths || 1),
    sizeSqft: prop.propertySize !== undefined ? prop.propertySize : (prop.sizeSqft || 1000),
    propertySize: prop.propertySize !== undefined ? prop.propertySize : (prop.sizeSqft || 1000),
    image: images[0],
    gallery: images,
    images: images,
    amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
    extraFeatures: Array.isArray(prop.extraFeatures) ? prop.extraFeatures : (prop.amenities || []),
    maxGuests: prop.extraFeatures?.maxGuests || 4,
    status: statusDisplay,
    rejectionFeedback: prop.rejectionFeedback || '',
    host,
    ownerName: host.name,
    ownerEmail: host.email,
    rating: prop.rating || 4.9,
    reviews: prop.reviews || 12,
  };
};


export const fetchFeaturedProperties = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.PROPERTIES.FEATURED, {
    params: { limit: 6 },
  });
  const data = response.data?.data || response.data || [];
  if (Array.isArray(data)) {
    return data.map(normalizeProperty).slice(0, 6);
  }
  return [];
};

export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: fetchFeaturedProperties,
    staleTime: 5 * 60 * 1000,
  });
};


export const fetchPropertiesList = async (params = {}) => {
  const queryParams = {};

  if (params.location) queryParams.location = params.location;
  if (params.search) queryParams.search = params.search;
  if (params.propertyType && params.propertyType !== 'All') queryParams.propertyType = params.propertyType;
  if (params.minPrice !== undefined && params.minPrice !== '') queryParams.minPrice = Number(params.minPrice);
  if (params.maxPrice !== undefined && params.maxPrice !== '') queryParams.maxPrice = Number(params.maxPrice);
  if (params.sort) queryParams.sort = params.sort;
  if (params.page) queryParams.page = Number(params.page);
  if (params.limit) queryParams.limit = Number(params.limit);

  const response = await axiosInstance.get(API_ENDPOINTS.PROPERTIES.LIST, { params: queryParams });
  const rawList = response.data?.data || response.data || [];
  const normalizedList = Array.isArray(rawList) ? rawList.map(normalizeProperty) : [];

  const totalItems = response.data?.total || response.data?.pagination?.totalItems || normalizedList.length;
  const limitNum = Number(params.limit) || 6;
  const totalPages = response.data?.pagination?.totalPages || Math.ceil(totalItems / limitNum) || 1;

  return {
    data: normalizedList,
    pagination: response.data?.pagination || {
      currentPage: Number(params.page) || 1,
      totalPages: totalPages,
      totalItems: totalItems,
      limit: limitNum,
    },
  };
};

export const usePropertiesList = (params = {}) => {
  return useQuery({
    queryKey: ['properties', 'list', params],
    queryFn: () => fetchPropertiesList(params),
    staleTime: 5 * 60 * 1000,
  });
};


export const fetchPropertyDetails = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.PROPERTIES.DETAILS(id));
  const rawData = response.data?.data || response.data;
  const property = normalizeProperty(rawData);

  
  try {
    const reviewRes = await axiosInstance.get(API_ENDPOINTS.REVIEWS.BY_PROPERTY(id));
    const reviewsList = reviewRes.data?.data || reviewRes.data || [];
    if (Array.isArray(reviewsList) && reviewsList.length > 0) {
      property.reviewsList = reviewsList.map(r => ({
        id: r._id || r.id,
        name: r.name || 'Anonymous Tenant',
        email: r.email || '',
        rating: r.rating || 5,
        comment: r.comment || '',
        date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '2026-07-27',
      }));
      property.reviews = property.reviewsList.length;
    }
  } catch (e) {}

  return property;
};

export const usePropertyDetails = (id) => {
  return useQuery({
    queryKey: ['properties', 'details', id],
    queryFn: () => fetchPropertyDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};


export const toggleFavoriteProperty = async (propertyId, isCurrentlyFavorite = false) => {
  if (isCurrentlyFavorite) {
    const response = await axiosInstance.delete(API_ENDPOINTS.FAVORITES.REMOVE(propertyId));
    return response.data;
  } else {
    const response = await axiosInstance.post(API_ENDPOINTS.FAVORITES.ADD, { propertyId });
    return response.data;
  }
};


export const submitPropertyReview = async (propertyId, reviewData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REVIEWS.CREATE, {
    propertyId,
    rating: Number(reviewData.rating) || 5,
    comment: reviewData.comment || '',
  });
  return response.data;
};
