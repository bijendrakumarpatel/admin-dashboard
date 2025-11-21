import React from "react";
import { StatCard } from "../../components/Cards";

export default function CardsSection({ summary }) {
  const {
    totalCustomers = 0,
    totalProducts = 0,
    totalOrders = 0,
    totalRevenue = 0,
  } = summary || {};

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 16,
      }}
    >
      <StatCard
        label="Customers"
        value={totalCustomers}
        hint="Total active customers"
        trend={5}
      />
      <StatCard
        label="Products"
        value={totalProducts}
        hint="Total active products"
        trend={2}
      />
      <StatCard
        label="Orders"
        value={totalOrders}
        hint="All-time orders"
        trend={-3}
      />
      <StatCard
        label="Revenue"
        value={`₹${totalRevenue.toLocaleString()}`}
        hint="Total revenue"
        trend={8}
      />
    </div>
  );
}
