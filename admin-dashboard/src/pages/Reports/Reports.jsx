import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";

import "./Reports.css";

// Dummy for now
const fakeReports = [
  { type: "Sales", amount: 50000, date: "2024-01-05" },
  { type: "Expenses", amount: 12000, date: "2024-01-06" },
];

export default function Reports() {
  const [filter, setFilter] = useState({
    from: "",
    to: "",
    type: "",
  });

  const columns = [
    { header: "Type", accessor: "type" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
  ];

  return (
    <AdminLayout title="Reports">
      <div className="reports-page">

        <h2 style={{ fontSize: 18 }}>Generate Reports</h2>

        <div style={{ display: "flex", gap: 16 }}>
          <div>
            <label>From</label>
            <input
              type="date"
              value={filter.from}
              onChange={(e) => setFilter({ ...filter, from: e.target.value })}
            />
          </div>

          <div>
            <label>To</label>
            <input
              type="date"
              value={filter.to}
              onChange={(e) => setFilter({ ...filter, to: e.target.value })}
            />
          </div>

          <div>
            <label>Type</label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="">All</option>
              <option value="sales">Sales</option>
              <option value="expenses">Expenses</option>
              <option value="payments">Payments</option>
            </select>
          </div>

          <button style={{ height: 38, marginTop: 22 }}>Filter</button>
        </div>

        <DataTable columns={columns} data={fakeReports} />
      </div>
    </AdminLayout>
  );
}
