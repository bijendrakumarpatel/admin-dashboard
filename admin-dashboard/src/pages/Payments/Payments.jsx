import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader/Loader";
import {
  getPayments,
  createPayment,
  deletePayment
} from "../../api/paymentApi";

import PaymentAddForm from "./PaymentAddForm";
import "./Payments.css";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    try {
      const res = await getPayments();
      setPayments(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Customer", accessor: "customerId" },
    { header: "Amount", accessor: "amount" },
    { header: "Method", accessor: "method" },
    { header: "Date", accessor: "date" },
    {
      header: "Delete",
      render: (row) => (
        <button onClick={() => remove(row.id)} style={{ color: "red" }}>
          Delete
        </button>
      ),
    },
  ];

  const add = async (data) => {
    await createPayment(data);
    setShowAdd(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete payment?")) return;
    await deletePayment(id);
    load();
  };

  return (
    <AdminLayout title="Payments">
      <div className="payments-page">
        <button onClick={() => setShowAdd(true)}>+ Add Payment</button>

        {loading ? <Loader /> : <DataTable columns={columns} data={payments} />}

        <Modal open={showAdd} title="Add Payment" onClose={() => setShowAdd(false)}>
          <PaymentAddForm onSubmit={add} onCancel={() => setShowAdd(false)} />
        </Modal>
      </div>
    </AdminLayout>
  );
}
