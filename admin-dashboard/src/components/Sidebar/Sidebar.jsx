 import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Customers", path: "/customers" },
  { label: "Products", path: "/products" },
  { label: "Agreements", path: "/agreements" },
  { label: "Orders", path: "/orders" },
  { label: "Payments", path: "/payments" },
  { label: "Expenses", path: "/expenses" },
  { label: "Reports", path: "/reports" },
  { label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-logo">CM</span>
        <span className="sidebar__brand-name">Company Manager</span>
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              "sidebar__link" + (isActive ? " sidebar__link--active" : "")
            }
          >
            <span className="sidebar__link-dot" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}