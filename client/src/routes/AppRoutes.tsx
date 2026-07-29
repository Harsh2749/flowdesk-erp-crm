import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import BlankLayout from '../layouts/BlankLayout';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import OAuthCallback from '../pages/auth/OAuthCallback';

import DashboardSummary from '../pages/dashboard/DashboardSummary';
import CustomerList from '../pages/customer/CustomerList';
import CustomerDetail from '../pages/customer/CustomerDetail';
import FollowupList from '../pages/followup/FollowupList';
import ProductList from '../pages/product/ProductList';
import InventoryOverview from '../pages/inventory/InventoryOverview';
import ChallanList from '../pages/challan/ChallanList';
import ChallanDetail from '../pages/challan/ChallanDetail';

import NotFound from '../pages/errors/NotFound';
import Unauthorized from '../pages/errors/Unauthorized';
import ServerError from '../pages/errors/ServerError';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ AuthLayout wrapper HATA DIYA — Login.tsx apna poora page khud banata hai */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardSummary />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/followups" element={<FollowupList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/inventory" element={<InventoryOverview />} />
          <Route path="/challans" element={<ChallanList />} />
          <Route path="/challans/:id" element={<ChallanDetail />} />
        </Route>
      </Route>

      <Route element={<BlankLayout />}>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}