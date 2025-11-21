import React from "react";
import "./layout.css";

export default function PublicLayout({ children }) {
  return (
    <div className="app-root">
      <div className="public-layout">
        <header className="public-layout__header">
          <h1 className="public-layout__title">Company Manager</h1>
        </header>
        <div className="public-layout__body">{children}</div>
      </div>
    </div>
  );
}
