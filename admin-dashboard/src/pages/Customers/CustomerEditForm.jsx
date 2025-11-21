import React, { useState, useEffect } from "react";

export default function CustomerEditForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
      });
    }
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(form);
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
        <div style={{ fontSize: 13, marginBottom: 2 }}>Phone</div>
        <input
          type="text"
          value={form.phone}
          onChange={handleChange("phone")}
          style={{ width: "100%", padding: 8, fontSize: 13 }}
        />
      </label>

      <label>
        <div style={{ fontSize: 13, marginBottom: 2 }}>Email</div>
        <input
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          style={{ width: "100%", padding: 8, fontSize: 13 }}
        />
      </label>

      <label>
        <div style={{ fontSize: 13, marginBottom: 2 }}>Address</div>
        <textarea
          value={form.address}
          onChange={handleChange("address")}
          rows={3}
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
          Update
        </button>
      </div>
    </form>
  );
}
