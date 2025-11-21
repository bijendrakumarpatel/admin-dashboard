import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../api/customerApi";
import CustomerAddForm from "./CustomerAddForm";
import CustomerEditForm from "./CustomerEditForm";
import "./Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // "add" | "edit"
  const [selected, setSelected] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = async (form) => {
    try {
      await createCustomer(form);
      setModalType(null);
      await fetchCustomers();
    } catch (err) {
      console.error("Create customer failed:", err);
    }
  };

  const handleEdit = async (form) => {
    try {
      await updateCustomer(selected.id, form);
      setModalType(null);
      setSelected(null);
      await fetchCustomers();
    } catch (err) {
      console.error("Update customer failed:", err);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete customer "${row.name}"?`)) return;
    try {
      await deleteCustomer(row.id);
      await fetchCustomers();
    } catch (err) {
      console.error("Delete customer failed:", err);
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Email", accessor: "email" },
    { header: "Address", accessor: "address" },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              setSelected(row);
              setModalType("edit");
            }}
            style={{
              padding: "3px 8px",
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            style={{
              padding: "3px 8px",
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid #fecaca",
              background: "#fee2e2",
              color: "#b91c1c",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Customers">
      <div className="customers-page">
        <div className="customers-page__header">
          <div className="customers-page__title">Customers</div>
          <div className="customers-page__actions">
            <button
              className="customers-page__button"
              onClick={() => setModalType("add")}
            >
              + New Customer
            </button>
          </div>
        </div>

        {loading ? (
          <Loader size={40} />
        ) : (
          <DataTable columns={columns} data={customers} />
        )}

        <Modal
          open={modalType === "add"}
          title="Add Customer"
          onClose={() => setModalType(null)}
        >
          <CustomerAddForm
            onSubmit={handleAdd}
            onCancel={() => setModalType(null)}
          />
        </Modal>

        <Modal
          open={modalType === "edit"}
          title="Edit Customer"
          onClose={() => {
            setModalType(null);
            setSelected(null);
          }}
        >
          <CustomerEditForm
            initialData={selected}
            onSubmit={handleEdit}
            onCancel={() => {
              setModalType(null);
              setSelected(null);
            }}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
