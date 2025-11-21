import React from "react";
import "./Modal.css";

export default function Modal({ open, title, onClose, children, width = 480 }) {
  if (!open) return null;

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div
        className="modal__content"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
