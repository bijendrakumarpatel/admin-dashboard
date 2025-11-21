import React from "react";
import "./Navbar.css";

export default function Navbar({ title = "Dashboard" }) {
  return (
    <header className="navbar">
      <div className="navbar__left">
        <h1 className="navbar__title">{title}</h1>
        <p className="navbar__subtitle">Manage your company data in one place.</p>
      </div>

      <div className="navbar__right">
        <div className="navbar__search">
          <input placeholder="Search..." />
        </div>

        <div className="navbar__user">
          <div className="navbar__avatar">A</div>
          <div className="navbar__user-info">
            <span className="navbar__user-name">Admin User</span>
            <span className="navbar__user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
