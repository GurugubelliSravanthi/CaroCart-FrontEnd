// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserSignup from "./pages/user/UserSignup";
import UserLogin from "./pages/user/UserLogin";
import UserDashBoard from "./pages/user/UserDashBoard";
import UserProfile from "./pages/user/UserProfile";
import ProductList from "./pages/user/ProductList";
import UserCart from "./pages/user/UserCart";

import VendorSignupOtpRequest from "./pages/vendor/VendorSignupOtpRequest";
import VendorSignupOtpVerify from "./pages/vendor/VendorSignupOtpVerify";
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProfile from "./pages/vendor/VendorProfile";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductManagement from "./pages/admin/AdminProductManagement";
import AdminVendorApproval from "./pages/admin/AdminVendorApproval";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminAddCategory from "./pages/admin/AdminAddCategory";

import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/home/HomePage";
import AppNavbar from "./components/Navbar/AppNavbar";
import UserCart from "./pages/user/UserCart";

import ForgotPasswordFlow from "./pages/user/ForgotPasswordFlow";
import ForgotPassword from "./pages/user/ForgotPassword";
import VerifyOTP from "./pages/user/VerifyOtp";
import ResetPassword from "./pages/user/ResetPassword";


// Optional future admin pages
// import AdminAnalytics from "./pages/admin/AdminAnalytics";
// import AdminOrderManagement from "./pages/admin/AdminOrderManagement";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>

        <Route path="/forgot-password" element={<ForgotPasswordFlow />}>
          <Route index element={<ForgotPassword />} />
          <Route path="verify-otp" element={<VerifyOTP />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user/cart" element={<UserCart />} />

        {/* User routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashBoard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          }
        />

        {/* Vendor routes */}
        <Route
          path="/vendors/signup/request-otp"
          element={<VendorSignupOtpRequest />}
        />
        <Route
          path="/vendors/signup/verify-otp"
          element={<VendorSignupOtpVerify />}
        />
        <Route path="/vendors/login" element={<VendorLogin />} />
        <Route
          path="/vendors/dashboard"
          element={
            <PrivateRoute>
              <VendorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendors/profile"
          element={
            <PrivateRoute>
              <VendorProfile />
            </PrivateRoute>
          }
        />

        {/* Admin login (separate from dashboard layout) */}
        <Route path="/admins/login" element={<AdminLogin />} />

        {/* Admin dashboard with nested routes */}
        <Route
          path="/admins/dashboard"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admins/vendors/pending"
          element={
            <PrivateRoute role="ADMIN">
              <AdminVendorApproval />
            </PrivateRoute>
          }
        />
        <Route
          path="/admins/products"
          element={
            <PrivateRoute role="ADMIN">
              <AdminProductManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/admins/categories/add"
          element={
            <PrivateRoute role="ADMIN">
              <AdminAddCategory />
            </PrivateRoute>
          }
        />

        <Route
          path="/admins/products/add"
          element={
            <PrivateRoute role="ADMIN">
              <AdminAddProduct />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
