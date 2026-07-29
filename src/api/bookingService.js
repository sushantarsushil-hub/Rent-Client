import axiosInstance from './axiosInstance';
import API_ENDPOINTS from './endpoints';


export const createBooking = async (bookingData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.BOOKINGS.CREATE, {
    propertyId: bookingData.propertyId || bookingData.id,
    moveInDate: bookingData.moveInDate,
    contactNumber: bookingData.contactNumber || bookingData.phone,
    userInfo: bookingData.userInfo || {
      name: bookingData.name,
      email: bookingData.email,
    },
    additionalNotes: bookingData.additionalNotes || '',
  });
  return response.data;
};


export const fetchMyBookings = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS);
  return response.data?.data || response.data || [];
};


export const fetchOwnerBookingRequests = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.OWNER_REQUESTS);
  return response.data?.data || response.data || [];
};


export const approveBooking = async (bookingId) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.BOOKINGS.APPROVE(bookingId));
  return response.data;
};


export const rejectBooking = async (bookingId) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.BOOKINGS.REJECT(bookingId));
  return response.data;
};
