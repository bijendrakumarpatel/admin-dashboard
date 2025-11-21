import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./layout.css";

export default function AdminLayout({ title = "Dashboard", children }) {
  return (
    <div className="app-root">
      <div className="admin-layout">
        <div className="admin-layout__sidebar">
          <Sidebar />
        </div>

        <div className="admin-layout__content">
          <Navbar title={title} />
          <main className="admin-layout__main">{children}</main>
        </div>
      </div>
    </div>
  );
}
