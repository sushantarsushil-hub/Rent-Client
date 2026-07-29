import { useQuery } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';
import { normalizeProperty } from './propertyService';


export const normalizeTenantBooking = (b) => {
  if (!b) return null;
  const prop = typeof b.propertyId === 'object' && b.propertyId !== null ? b.propertyId : {};
  const image = Array.isArray(prop.images) && prop.images.length > 0
    ? prop.images[0]
    : prop.image || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80';

  const rawBookingStatus = b.bookingStatus || b.status || 'pending';
  const bookingStatusDisplay = rawBookingStatus.charAt(0).toUpperCase() + rawBookingStatus.slice(1);

  const rawPaymentStatus = b.paymentStatus || 'pending';
  const paymentStatusDisplay = rawPaymentStatus.charAt(0).toUpperCase() + rawPaymentStatus.slice(1);

  return {
    ...b,
    id: b._id || b.id || 'BK-' + Math.floor(1000 + Math.random() * 9000),
    propertyName: prop.title || b.propertyName || 'Property Stay',
    location: prop.location || b.location || 'Location',
    bookingDate: b.moveInDate ? new Date(b.moveInDate).toISOString().split('T')[0] : (b.bookingDate || '2026-08-10'),
    moveInDate: b.moveInDate ? new Date(b.moveInDate).toISOString().split('T')[0] : '2026-08-10',
    amountPaid: b.amount || b.amountPaid || 0,
    amount: b.amount || b.amountPaid || 0,
    bookingStatus: bookingStatusDisplay,
    paymentStatus: paymentStatusDisplay,
    image,
  };
};


export const fetchTenantBookings = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS);
  const data = response.data?.data || response.data || [];
  if (Array.isArray(data)) {
    return data.map(normalizeTenantBooking);
  }
  return [];
};

export const useTenantBookings = (options = {}) => {
  return useQuery({
    queryKey: ['tenant', 'bookings'],
    queryFn: fetchTenantBookings,
    staleTime: 0,
    refetchOnMount: true,
    ...options,
  });
};


export const fetchTenantFavorites = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.FAVORITES.LIST);
  const data = response.data?.data || response.data || [];
  if (Array.isArray(data)) {
    return data.map((fav) => {
      const propObj = typeof fav.propertyId === 'object' && fav.propertyId !== null ? fav.propertyId : fav;
      return normalizeProperty(propObj);
    }).filter(Boolean);
  }
  return [];
};

export const useTenantFavorites = (options = {}) => {
  return useQuery({
    queryKey: ['tenant', 'favorites'],
    queryFn: fetchTenantFavorites,
    staleTime: 0,
    refetchOnMount: true,
    ...options,
  });
};


export const fetchTenantTransactions = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.MY_TRANSACTIONS);
  const data = response.data?.data || response.data || [];
  return Array.isArray(data) ? data : [];
};

export const useTenantTransactions = () => {
  return useQuery({
    queryKey: ['tenant', 'transactions'],
    queryFn: fetchTenantTransactions,
    staleTime: 5 * 60 * 1000,
  });
};


export const addTenantFavorite = async (propertyId) => {
  const response = await axiosInstance.post(API_ENDPOINTS.FAVORITES.ADD, { propertyId });
  return response.data;
};

export const addFavoriteProperty = addTenantFavorite;

export const removeTenantFavorite = async (propertyId) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.FAVORITES.REMOVE(propertyId));
  return response.data;
};

export const removeFavoriteProperty = removeTenantFavorite;


export const toggleFavoriteProperty = async (propertyId, isCurrentlyFavorite = false) => {
  if (isCurrentlyFavorite) {
    return await removeTenantFavorite(propertyId);
  } else {
    return await addTenantFavorite(propertyId);
  }
};

