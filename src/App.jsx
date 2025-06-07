// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import NotFound from "./pages/common/NotFound";
import UserSignup from "./pages/user/UserSignUp/UserSignup";
import UserLogin from "./pages/user/UserLogin/UserLogin";
import UserDashBoard from "./pages/user/UserDashboard/UserDashBoard";
import UserProfile from "./pages/user/UserProfile/UserProfile";
import UserCart from "./pages/user/UserCart/UserCart";

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
import AppNavbar from "./components/Navbar/AppNavbar";

import ForgotPasswordFlow from "./pages/user/ForgotPassword/ForgotPasswordFlow";
import ForgotPassword from "./pages/user/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword/ResetPassword";
import VerifyOTP from "./pages/user/ForgotPassword/VerifyOTP";
import Checkout from "./pages/user/CheckOut/Checkout";
import MyOrders from "./pages/user/MyOrders/MyOrders";

// import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminOrderManagement from "./pages/admin/AdminOrderManagement";

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
        <Route path="/checkout" element={<Checkout />} />

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
          path="/orders/my"
          element={
            <PrivateRoute>
              <MyOrders />
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
        >
          <Route path="vendors/pending" element={<AdminVendorApproval />} />
          <Route path="products" element={<AdminProductManagement />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="categories/add" element={<AdminAddCategory />} />
          <Route path="orders" element={<AdminOrderManagement />} />
          {/* <Route path="analytics" element={<AdminAnalytics />} /> */}
        </Route>

        {/* 404 fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
