import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../api/endpoints';
import { showToast } from '../utils/toast';

const AuthContext = createContext(null);

export const getDashboardPath = (role) => {
  const normalized = (role || '').toLowerCase();
  if (normalized === 'admin') return '/dashboard/admin';
  if (normalized === 'owner' || normalized === 'host') return '/dashboard/owner';
  return '/dashboard/tenant';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const initAuthSession = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      
      try {
        const storedToken = localStorage.getItem('rentify_token');
        const storedUser = localStorage.getItem('rentify_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to parse local stored user session:', e);
      }

      
      const urlParams = new URLSearchParams(window.location.search);
      const oauthToken = urlParams.get('token');

      if (oauthToken) {
        try {
          localStorage.setItem('rentify_token', oauthToken);
          setToken(oauthToken);

          const res = await axiosInstance.get(API_ENDPOINTS.AUTH.ME, {
            headers: { Authorization: `Bearer ${oauthToken}` },
          });

          if (res.data?.data?.user || res.data?.user) {
            const userData = res.data?.data?.user || res.data?.user;
            setUser(userData);
            localStorage.setItem('rentify_user', JSON.stringify(userData));
            showToast.success(`Welcome, ${userData.name || 'User'}!`);
          }

          window.history.replaceState({}, document.title, window.location.pathname);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Failed to verify Google OAuth session token:', e);
        }
      }

      
      const existingToken = localStorage.getItem('rentify_token');

      if (existingToken) {
        try {
          const res = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
          const serverUser = res.data?.data?.user || res.data?.user || res.data?.data;
          const serverToken = res.data?.data?.token || res.data?.token || existingToken;

          if (serverUser && typeof serverUser === 'object') {
            setUser(serverUser);
            setToken(serverToken);
            localStorage.setItem('rentify_user', JSON.stringify(serverUser));
            localStorage.setItem('rentify_token', serverToken);
          }
        } catch (err) {
          
          if (err?.response?.status === 401) {
            localStorage.removeItem('rentify_token');
            localStorage.removeItem('rentify_user');
            setToken(null);
            setUser(null);
          }
        }
      }

      setLoading(false);
    };

    initAuthSession();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rentify_token', authToken);
      localStorage.setItem('rentify_user', JSON.stringify(userData));
    }
    showToast.success(`Welcome back, ${userData?.name || 'User'}!`);
  };

  const updateUser = (newUserData) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...newUserData };
      if (typeof window !== 'undefined') {
        localStorage.setItem('rentify_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logout = async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      console.info('Logout server notification completed');
    }
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rentify_token');
      localStorage.removeItem('rentify_user');
    }
    showToast.info('You have logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role: user?.role || 'Tenant',
        dashboardPath: getDashboardPath(user?.role),
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      role: 'Guest',
      dashboardPath: '/dashboard/tenant',
      login: () => {},
      updateUser: () => {},
      logout: () => {},
    };
  }
  return context;
};

export default AuthProvider;
