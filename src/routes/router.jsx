import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleBasedRoute from '../components/common/RoleBasedRoute';
import PageLoader from '../components/common/PageLoader';


const Home = lazy(() => import('../views/public/Home'));
const Properties = lazy(() => import('../views/public/Properties'));
const PropertyDetails = lazy(() => import('../views/public/PropertyDetails'));
const NotFound = lazy(() => import('../views/public/NotFound'));
const Forbidden = lazy(() => import('../views/public/Forbidden'));
const LoadingPage = lazy(() => import('../views/public/LoadingPage'));
const ErrorPage = lazy(() => import('../views/public/ErrorPage'));


const Login = lazy(() => import('../views/auth/Login'));
const Register = lazy(() => import('../views/auth/Register'));
const OAuthSuccess = lazy(() => import('../views/auth/OAuthSuccess'));


const PaymentCheckout = lazy(() => import('../views/public/PaymentCheckout'));
const PaymentSuccess = lazy(() => import('../views/public/PaymentSuccess'));
const PaymentFailure = lazy(() => import('../views/public/PaymentFailure'));


const TenantHome = lazy(() => import('../views/dashboard/tenant/TenantHome'));
const TenantBookings = lazy(() => import('../views/dashboard/tenant/TenantBookings'));
const TenantFavorites = lazy(() => import('../views/dashboard/tenant/TenantFavorites'));
const TenantProfile = lazy(() => import('../views/dashboard/tenant/TenantProfile'));


const OwnerHome = lazy(() => import('../views/dashboard/owner/OwnerHome'));
const AddProperty = lazy(() => import('../views/dashboard/owner/AddProperty'));
const MyProperties = lazy(() => import('../views/dashboard/owner/MyProperties'));
const BookingRequests = lazy(() => import('../views/dashboard/owner/BookingRequests'));
const OwnerProfile = lazy(() => import('../views/dashboard/owner/OwnerProfile'));


const AdminHome = lazy(() => import('../views/dashboard/admin/AdminHome'));
const AdminUsers = lazy(() => import('../views/dashboard/admin/AdminUsers'));
const AdminProperties = lazy(() => import('../views/dashboard/admin/AdminProperties'));
const AdminBookings = lazy(() => import('../views/dashboard/admin/AdminBookings'));
const AdminTransactions = lazy(() => import('../views/dashboard/admin/AdminTransactions'));
const AdminProfile = lazy(() => import('../views/dashboard/admin/AdminProfile'));

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingPage message="Loading application component..." />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: withSuspense(ErrorPage),
    children: [
      { index: true, element: withSuspense(Home) },
      { path: 'properties', element: withSuspense(Properties) },
      { path: 'loading', element: withSuspense(LoadingPage) },
      { path: 'error', element: withSuspense(ErrorPage) },
      {
        path: 'properties/:id',
        element: (
          <ProtectedRoute>
            {withSuspense(PropertyDetails)}
          </ProtectedRoute>
        ),
      },
      { path: 'login', element: withSuspense(Login) },
      { path: 'register', element: withSuspense(Register) },
      { path: 'oauth-success', element: withSuspense(OAuthSuccess) },
      { path: 'forbidden', element: withSuspense(Forbidden) },
      {
        path: 'payment/checkout',
        element: (
          <ProtectedRoute>
            {withSuspense(PaymentCheckout)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'payment/success',
        element: (
          <ProtectedRoute>
            {withSuspense(PaymentSuccess)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'payment/failed',
        element: (
          <ProtectedRoute>
            {withSuspense(PaymentFailure)}
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'tenant',
        element: <RoleBasedRoute allowedRoles={['tenant']}>{withSuspense(TenantHome)}</RoleBasedRoute>,
      },
      {
        path: 'tenant/bookings',
        element: <RoleBasedRoute allowedRoles={['tenant']}>{withSuspense(TenantBookings)}</RoleBasedRoute>,
      },
      {
        path: 'tenant/favorites',
        element: <RoleBasedRoute allowedRoles={['tenant']}>{withSuspense(TenantFavorites)}</RoleBasedRoute>,
      },
      {
        path: 'tenant/profile',
        element: <RoleBasedRoute allowedRoles={['tenant']}>{withSuspense(TenantProfile)}</RoleBasedRoute>,
      },
      {
        path: 'owner',
        element: <RoleBasedRoute allowedRoles={['owner', 'host']}>{withSuspense(OwnerHome)}</RoleBasedRoute>,
      },
      {
        path: 'owner/add-property',
        element: <RoleBasedRoute allowedRoles={['owner', 'host']}>{withSuspense(AddProperty)}</RoleBasedRoute>,
      },
      {
        path: 'owner/properties',
        element: <RoleBasedRoute allowedRoles={['owner', 'host']}>{withSuspense(MyProperties)}</RoleBasedRoute>,
      },
      {
        path: 'owner/booking-requests',
        element: <RoleBasedRoute allowedRoles={['owner', 'host']}>{withSuspense(BookingRequests)}</RoleBasedRoute>,
      },
      {
        path: 'owner/profile',
        element: <RoleBasedRoute allowedRoles={['owner', 'host']}>{withSuspense(OwnerProfile)}</RoleBasedRoute>,
      },
      {
        path: 'admin',
        element: <RoleBasedRoute allowedRoles={['admin']}>{withSuspense(AdminHome)}</RoleBasedRoute>,
      },
      {
        path: 'admin/users',
        element: <RoleBasedRoute allowedRoles={['admin']}>{withSuspense(AdminUsers)}</RoleBasedRoute>,
      },
      {
        path: 'admin/properties',
        element: <RoleBasedRoute allowedRoles={['admin']}>{withSuspense(AdminProperties)}</RoleBasedRoute>,
      },
      {
        path: 'admin/bookings',
        element: <RoleBasedRoute allowedRoles={['admin']}>{withSuspense(AdminBookings)}</RoleBasedRoute>,
      },
      {
        path: 'admin/transactions',
        element: <RoleBasedRoute allowedRoles={['admin']}>{withSuspense(AdminTransactions)}</RoleBasedRoute>,
      },
      {
        path: 'admin/profile',
        element: <RoleBasedRoute allowedRoles={['admin']}>{withSuspense(AdminProfile)}</RoleBasedRoute>,
      },
    ],
  },
  {
    path: '*',
    element: withSuspense(NotFound),
  },
]);

export default router;
