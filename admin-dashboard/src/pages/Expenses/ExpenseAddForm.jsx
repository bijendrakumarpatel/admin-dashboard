import React, { useState } from "react";

export default function ExpenseAddForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
  });

  const change = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={form.title} onChange={change("title")} required />
      </label>

      <label>
        Amount
        <input type="number" value={form.amount} onChange={change("amount")} required />
      </label>

      <label>
        Category
        <input value={form.category} onChange={change("category")} />
      </label>

      <label>
        Date
        <input type="date" value={form.date} onChange={change("date")} />
      </label>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Add Expense</button>
      </div>
    </form>
  );
}
