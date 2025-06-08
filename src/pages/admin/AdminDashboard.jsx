import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaUserCheck,
  FaBoxOpen,
  FaPlusSquare,
  FaTags,
  FaClipboardList,
  FaChartBar,
  FaUsers, // 👈 Icon for Manage Users
} from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const menuItems = [
    { title: "Approve Vendors", path: "vendors/pending", icon: <FaUserCheck /> },
    { title: "Manage Products", path: "products", icon: <FaBoxOpen /> },
    { title: "Add Product", path: "products/add", icon: <FaPlusSquare /> },
    { title: "Manage Categories", path: "categories/add", icon: <FaTags /> },
    { title: "Order Management", path: "orders", icon: <FaClipboardList /> },
    { title: "Manage Users", path: "users", icon: <FaUsers /> }, // ✅ Newly Added
    { title: "Analytics", path: "analytics", icon: <FaChartBar /> },
  ];

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">⚙️ Admin Dashboard</h2>
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
