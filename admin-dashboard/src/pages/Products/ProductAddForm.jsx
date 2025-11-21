import React, { useState } from "react";

export default function ProductAddForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit &&
      onSubmit({
        ...form,
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label>
        <div style={{ fontSize: 13, marginBottom: 2 }}>Name</div>
        <input
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          required
          style={{ width: "100%", padding: 8, fontSize: 13 }}
        />
      </label>

      <label>
        <div style={{ fontSize: 13, marginBottom: 2 }}>SKU</div>
        <input
          type="text"
          value={form.sku}
          onChange={handleChange("sku")}
          style={{ width: "100%", padding: 8, fontSize: 13 }}
        />
      </label>

      <label>
        <div style={{ fontSize: 13, marginBottom: 2 }}>Price</div>
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange("price")}
          style={{ width: "100%", padding: 8, fontSize: 13 }}
        />
      </label>

      <label>
        <div style={{ fontSize: 13, marginBottom: 2 }}>Stock</div>
        <input
          type="number"
          value={form.stock}
          onChange={handleChange("stock")}
          style={{ width: "100%", padding: 8, fontSize: 13 }}
        />
      </label>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 13,
            cursor: "pointer",
            background: "#f9fafb",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "none",
            fontSize: 13,
            cursor: "pointer",
            background: "#111827",
            color: "#f9fafb",
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}
