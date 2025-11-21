import React, { useState } from "react";

export default function PaymentAddForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    method: "",
    remarks: "",
  });

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label>
        Customer ID
        <input type="number" value={form.customerId} onChange={change("customerId")} required />
      </label>

      <label>
        Amount
        <input type="number" value={form.amount} onChange={change("amount")} required />
      </label>

      <label>
        Method
        <select value={form.method} onChange={change("method")}>
          <option value="">Select method</option>
          <option>Cash</option>
          <option>Online</option>
          <option>Cheque</option>
        </select>
      </label>

      <label>
        Remarks
        <textarea value={form.remarks} onChange={change("remarks")}></textarea>
      </label>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Add Payment</button>
      </div>
    </form>
  );
}
