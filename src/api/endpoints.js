
export const API_ENDPOINTS = {
  
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    GOOGLE_TOKEN: '/auth/google/token',
  },
  
  PROPERTIES: {
    LIST: '/properties',
    DETAILS: (id) => `/properties/${id}`,
    FEATURED: '/properties/featured',
    CREATE: '/properties',
    UPDATE: (id) => `/properties/${id}`,
    DELETE: (id) => `/properties/${id}`,
    MY_PROPERTIES: '/properties/my-properties',
  },
  
  BOOKINGS: {
    CREATE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    OWNER_REQUESTS: '/owner/booking-requests',
    APPROVE: (id) => `/owner/bookings/${id}/approve`,
    REJECT: (id) => `/owner/bookings/${id}/reject`,
  },
  
  FAVORITES: {
    LIST: '/favorites',
    ADD: '/favorites',
    REMOVE: (propertyId) => `/favorites/${propertyId}`,
  },
  
  REVIEWS: {
    CREATE: '/reviews',
    BY_PROPERTY: (propertyId) => `/reviews/property/${propertyId}`,
  },

  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
  },
 
  OWNER: {
    ANALYTICS: '/owner/analytics',
  },
 
  ADMIN: {
    ANALYTICS: '/admin/analytics',
    USERS: '/admin/users',
    UPDATE_ROLE: (userId) => `/admin/users/${userId}/role`,
    PROPERTIES: '/admin/properties',
    APPROVE_PROPERTY: (id) => `/admin/properties/${id}/approve`,
    REJECT_PROPERTY: (id) => `/admin/properties/${id}/reject`,
    UPDATE_PROPERTY: (id) => `/admin/properties/${id}`,
    DELETE_PROPERTY: (id) => `/admin/properties/${id}`,
    BOOKINGS: '/admin/bookings',
    TRANSACTIONS: '/admin/transactions',
  },
};

export default API_ENDPOINTS;
