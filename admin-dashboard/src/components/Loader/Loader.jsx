import React from "react";
import "./Loader.css";

export default function Loader({ size = 32 }) {
  return (
    <div className="loader__wrapper">
      <div
        className="loader__spinner"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
