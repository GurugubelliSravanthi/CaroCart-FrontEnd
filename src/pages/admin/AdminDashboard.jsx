import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const menuItems = [
    { title: "Approve Vendors", path: "vendors/pending" },
    { title: "Manage Products", path: "products" },
    { title: "Add Product", path: "products/add" },
    { title: "Manage Categories", path: "categories/add" },
    { title: "Order Management", path: "orders" },
    { title: "Analytics", path: "analytics" },
  ];

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <h4 className="sidebar-title">Admin Panel</h4>
        <ul className="sidebar-menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                {item.title}
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
