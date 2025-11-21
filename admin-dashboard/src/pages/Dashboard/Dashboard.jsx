import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";

// Correct Imports
import { getSummary } from "../../api/dashboardApi";
import DataTable from "../../components/Table/DataTable";
import Loader from "../../components/Loader/Loader";
import CardsSection from "./CardsSection";

import "./Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      // NOTE: Ensure your backend sends 'recentOrders' in the response. 
      // If not, pass an empty array for now to avoid errors.
      const data = await getSummary();
      setSummary(data.summary || {});
      setRecentOrders(data.recentOrders || []);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // --- Premium Column Definitions ---
  const columns = [
    { 
      header: "Order ID", 
      accessor: "orderNumber",
      render: (row) => <span className="text-primary font-medium">#{row.id}</span>
    },
    { 
      header: "Customer", 
      accessor: "customerName",
      render: (row) => (
        <div className="customer-cell">
          <div className="customer-avatar">{row.customer_name?.charAt(0)}</div>
          <span>{row.customer_name || "Unknown"}</span>
        </div>
      )
    },
    { 
      header: "Amount", 
      accessor: "total_amount",
      render: (row) => <strong>${Number(row.total_amount).toFixed(2)}</strong>
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => {
        const status = row.status?.toLowerCase() || "pending";
        return <span className={`status-badge status-${status}`}>{row.status}</span>;
      }
    },
    { 
      header: "Date", 
      accessor: "order_date",
      render: (row) => new Date(row.order_date).toLocaleDateString()
    },
  ];

  return (
    <AdminLayout title="Overview">
      {loading ? (
        <Loader size={40} />
      ) : (
        <div className="dashboard-page">
          {/* 1. Stats Row */}
          <CardsSection summary={summary} />

          {/* 2. Content Row */}
          <div className="dashboard-page__row">
            
            {/* Left Panel: Recent Orders */}
            <div className="dashboard-page__panel">
              <div className="panel-header">
                <h3 className="panel-title">Recent Orders</h3>
                <button className="btn-link">View All</button>
              </div>
              <DataTable
                columns={columns}
                data={recentOrders}
                emptyText="No recent orders found."
              />
            </div>

            {/* Right Panel: Activity / Charts */}
            <div className="dashboard-page__panel">
              <div className="panel-header">
                <h3 className="panel-title">Activity Log</h3>
              </div>
              
              <div className="activity-placeholder">
                <div className="activity-item">
                  <span className="dot dot-blue"></span>
                  <p>New order received <b>#1024</b></p>
                  <span className="time">2 min ago</span>
                </div>
                <div className="activity-item">
                  <span className="dot dot-green"></span>
                  <p>Payment verified for <b>#1021</b></p>
                  <span className="time">1 hour ago</span>
                </div>
                <div className="activity-item">
                  <span className="dot dot-gray"></span>
                  <p>System backup completed</p>
                  <span className="time">5 hours ago</span>
                </div>
              </div>

              <div className="chart-placeholder">
                <p>Sales Chart Area</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}