import { useQuery } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';
import { normalizeProperty } from './propertyService';


export const fetchAdminMetrics = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.ANALYTICS);
    const data = response.data?.data || response.data;
    if (data) {
      return {
        totalRevenue: data.totalRevenue || 0,
        totalUsers: data.totalUsers || 0,
        totalTenants: data.totalTenants || 0,
        totalOwners: data.totalOwners || 0,
        totalAdmins: data.totalAdmins || 0,
        totalProperties: data.totalProperties || 0,
        pendingProperties: data.pendingProperties || 0,
        approvedProperties: data.approvedProperties || 0,
        rejectedProperties: data.rejectedProperties || 0,
        totalBookings: data.totalBookings || 0,
        pendingBookings: data.pendingBookings || 0,
        approvedBookings: data.approvedBookings || 0,
        rejectedBookings: data.rejectedBookings || 0,
        totalSuccessfulTransactions: data.totalSuccessfulTransactions || 0,
        activeStays: data.approvedBookings || 0,
      };
    }
  } catch (err) {
    console.error('Failed to fetch admin analytics:', err);
  }

  return {
    totalRevenue: 0,
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    activeStays: 0,
  };
};

export const useAdminMetrics = () => {
  return useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: fetchAdminMetrics,
    staleTime: 5 * 60 * 1000,
  });
};


export const fetchAdminUsers = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS);
  const data = response.data?.data || response.data || [];
  if (Array.isArray(data)) {
    return data.map((u) => {
      const rawRole = u.role || 'tenant';
      const roleDisplay = rawRole.charAt(0).toUpperCase() + rawRole.slice(1);
      return {
        ...u,
        id: u._id || u.id,
        name: u.name || 'User Name',
        email: u.email || '',
        role: roleDisplay,
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '2026-01-15',
      };
    });
  }
  return [];
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: fetchAdminUsers,
    staleTime: 5 * 60 * 1000,
  });
};

export const changeUserRole = async (userId, newRole) => {
  const normalizedRole = newRole.toLowerCase();
  const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN.UPDATE_ROLE(userId), { role: normalizedRole });
  return response.data;
};


export const fetchAdminProperties = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PROPERTIES);
  const data = response.data?.data || response.data || [];
  if (Array.isArray(data)) {
    return data.map(normalizeProperty);
  }
  return [];
};

export const useAdminProperties = () => {
  return useQuery({
    queryKey: ['admin', 'properties'],
    queryFn: fetchAdminProperties,
    staleTime: 5 * 60 * 1000,
  });
};


export const moderateProperty = async (propertyId, statusAction, rejectionFeedback = '') => {
  const isApproved = statusAction.toLowerCase() === 'approved' || statusAction.toLowerCase() === 'approve';
  if (isApproved) {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN.APPROVE_PROPERTY(propertyId));
    return response.data;
  } else {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN.REJECT_PROPERTY(propertyId), {
      rejectionFeedback: rejectionFeedback || 'Property photos or verification details require update.',
    });
    return response.data;
  }
};

export const approveAdminProperty = (propertyId) => moderateProperty(propertyId, 'Approved');
export const rejectAdminProperty = (propertyId, feedback) => moderateProperty(propertyId, 'Rejected', feedback);


export const deleteAdminProperty = async (propertyId) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.ADMIN.DELETE_PROPERTY(propertyId));
  return response.data;
};


export const fetchAdminBookings = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.BOOKINGS);
  const data = response.data?.data || response.data || [];
  if (Array.isArray(data)) {
    return data.map((b) => {
      const tenant = typeof b.tenantId === 'object' && b.tenantId !== null ? b.tenantId : {};
      const owner = typeof b.ownerId === 'object' && b.ownerId !== null ? b.ownerId : {};
      const prop = typeof b.propertyId === 'object' && b.propertyId !== null ? b.propertyId : {};

      const rawBookingStatus = b.bookingStatus || b.status || 'pending';
      const bookingStatusDisplay = rawBookingStatus.charAt(0).toUpperCase() + rawBookingStatus.slice(1);

      const rawPaymentStatus = b.paymentStatus || 'pending';
      const paymentStatusDisplay = rawPaymentStatus.charAt(0).toUpperCase() + rawPaymentStatus.slice(1);

      return {
        ...b,
        id: b._id || b.id || 'BK-9842',
        tenantName: b.userInfo?.name || tenant.name || 'Tenant User',
        propertyTitle: prop.title || 'Property Stay',
        ownerName: owner.name || 'Owner Host',
        amount: b.amount || 1875,
        bookingStatus: bookingStatusDisplay,
        paymentStatus: paymentStatusDisplay,
        bookingDate: b.moveInDate ? new Date(b.moveInDate).toISOString().split('T')[0] : '2026-08-10',
      };
    });
  }
  return [];
};

export const useAdminBookings = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: fetchAdminBookings,
    staleTime: 0,
    refetchOnMount: true,
    ...options,
  });
};


export const updateAdminBookingStatus = async (bookingId, status) => {
  const normalizedStatus = (status || '').toLowerCase();
  try {
    const response = await axiosInstance.patch(`/bookings/${bookingId}/status`, { status: normalizedStatus });
    return response.data;
  } catch (_err) {
    if (normalizedStatus === 'approved') {
      const res = await axiosInstance.patch(`/bookings/${bookingId}/approve`);
      return res.data;
    } else if (normalizedStatus === 'rejected') {
      const res = await axiosInstance.patch(`/bookings/${bookingId}/reject`);
      return res.data;
    }
    throw _err;
  }
};


export const fetchAdminTransactions = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.TRANSACTIONS);
  const data = response.data?.data || response.data || [];
  if (Array.isArray(data)) {
    return data.map((t) => {
      const tenant = typeof t.tenantId === 'object' && t.tenantId !== null ? t.tenantId : {};
      const owner = typeof t.ownerId === 'object' && t.ownerId !== null ? t.ownerId : {};
      const prop = typeof t.propertyId === 'object' && t.propertyId !== null ? t.propertyId : {};

      return {
        ...t,
        id: t.transactionId || t._id || t.id || 'TXN-88401',
        propertyName: prop.title || 'Property Stay',
        tenantName: tenant.name || 'Tenant User',
        ownerName: owner.name || 'Owner Host',
        amount: t.amount || 1875,
        date: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '2026-07-25',
      };
    });
  }
  return [];
};

export const useAdminTransactions = () => {
  return useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: fetchAdminTransactions,
    staleTime: 5 * 60 * 1000,
  });
};
