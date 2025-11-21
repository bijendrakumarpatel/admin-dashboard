import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal";
import { getOrders } from "../../api/orderApi";
import OrderDetails from "./OrderDetails";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  const load = async () => {
    try {
      const res = await getOrders();
      setOrders(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Customer", accessor: "customerName" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "date" },
    {
      header: "View",
      render: (row) => (
        <button onClick={() => setDetails(row)}>Details</button>
      )
    }
  ];

  return (
    <AdminLayout title="Orders">
      <div className="orders-page">
        <div className="orders-page__header">
          <div className="orders-page__title">Orders</div>
        </div>

        {loading ? <Loader /> : <DataTable columns={columns} data={orders} />}

        <Modal
          open={!!details}
          title="Order Details"
          onClose={() => setDetails(null)}
        >
          <OrderDetails order={details} />
        </Modal>
      </div>
    </AdminLayout>
  );
}
