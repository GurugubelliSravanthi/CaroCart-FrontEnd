// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserSignup from "./pages/user/UserSignup";
import UserLogin from "./pages/user/UserLogin";
import UserDashBoard from "./pages/user/UserDashBoard";
import UserProfile from "./pages/user/UserProfile";
import ProductList from "./pages/user/ProductList"; // <-- new import

import VendorSignupOtpRequest from "./pages/vendor/VendorSignupOtpRequest";
import VendorSignupOtpVerify from "./pages/vendor/VendorSignupOtpVerify";
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProfile from "./pages/vendor/VendorProfile";

import AdminLogin from "./pages/admin/AdminLogin"; // Admin login page
import AdminVendorApproval from "./pages/admin/AdminDashboard"; // Admin approve vendors page
import AdminProductManagement from "./pages/admin/AdminProductManagement"; // <-- new import

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
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

        {/* Admin routes */}
        <Route path="/admins/login" element={<AdminLogin />} />
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
      </Routes>
    </Router>
  );
}

export default App;
