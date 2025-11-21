import React from "react";

export default function OrderDetails({ order }) {
  if (!order) return <div>No details</div>;

  return (
    <div style={{ fontSize: 14, lineHeight: "20px" }}>
      <p><b>Order ID:</b> {order.id}</p>
      <p><b>Customer:</b> {order.customerName}</p>
      <p><b>Amount:</b> ₹{order.amount}</p>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Date:</b> {order.date}</p>
    </div>
  );
}
