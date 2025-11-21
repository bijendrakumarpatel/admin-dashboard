import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader/Loader";
import { getExpenses, createExpense } from "../../api/expenseApi";
import ExpenseAddForm from "./ExpenseAddForm";
import "./Expenses.css";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const load = async () => {
    try {
      const res = await getExpenses();
      setExpenses(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (data) => {
    await createExpense(data);
    setAddOpen(false);
    load();
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Amount", accessor: "amount" },
    { header: "Category", accessor: "category" },
    { header: "Date", accessor: "date" },
  ];

  return (
    <AdminLayout title="Expenses">
      <div className="expenses-page">
        <button onClick={() => setAddOpen(true)}>+ Add Expense</button>

        {loading ? <Loader /> : <DataTable columns={columns} data={expenses} />}

        <Modal open={addOpen} title="Add Expense" onClose={() => setAddOpen(false)}>
          <ExpenseAddForm onSubmit={add} onCancel={() => setAddOpen(false)} />
        </Modal>
      </div>
    </AdminLayout>
  );
}
