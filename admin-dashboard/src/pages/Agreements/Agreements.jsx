import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader/Loader";
// Mock API functions - replace with your actual imports
import {
  getAgreements,
  createAgreement,
  updateAgreement,
  deleteAgreement
} from "../../api/agreementApi";

import AgreementAddForm from "./AgreementAddForm";
import AgreementEditForm from "./AgreementEditForm";
import "./Agreements.css";

export default function Agreements() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | null
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAgreements();
      setAgreements(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch agreements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to extract readable type from metadata
  const getDocType = (remarks) => {
    try {
        const meta = JSON.parse(remarks);
        const mapping = {
            'professional_invoice': 'INVOICE',
            'paddy_receipt': 'PADDY RECEIPT',
            'lease': 'LEASE',
            'rtgs_template': 'RTGS',
            'ceo_letter': 'LETTER'
        };
        return mapping[meta.template] || meta.template?.toUpperCase() || "DOC";
    } catch(e) { return "DOC"; }
  };

  const cols = [
    { header: "ID", accessor: "id" },
    { header: "Customer ID", accessor: "customerId" },
    { header: "Date", accessor: "startDate" },
    { 
      header: "Type", 
      accessor: "remarks",
      render: (row) => <span className="badge badge-info">{getDocType(row.remarks)}</span>
    },
    { 
      header: "Amount", 
      accessor: "amount",
      render: (row) => `₹${Number(row.amount).toLocaleString('en-IN')}`
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="action-buttons">
          <button className="btn-icon edit" onClick={() => { setSelected(row); setModalType("edit"); }}>
            ✎
          </button>
          <button className="btn-icon delete" onClick={() => handleDelete(row)}>
            🗑
          </button>
        </div>
      ),
    },
  ];

  const handleAdd = async (data) => {
    try {
      await createAgreement(data);
      setModalType(null);
      fetchData();
    } catch (error) {
      console.error("Create failed", error);
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateAgreement(selected.id, data);
      setModalType(null);
      setSelected(null);
      fetchData();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete document #${row.id}?`)) return;
    try {
      await deleteAgreement(row.id);
      fetchData();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <AdminLayout title="Agreements & Documents">
      <div className="agreements-page">
        <div className="agreements-page__header">
          <div className="agreements-page__title">
            <h1>Document Manager</h1>
            <p className="text-muted">Generate Invoices, Paddy Receipts, Agreements & Letters</p>
          </div>
          <button className="btn-primary" onClick={() => setModalType("add")}>
            + Create New Document
          </button>
        </div>

        <div className="agreements-content">
          {loading ? <Loader /> : <DataTable columns={cols} data={agreements} />}
        </div>

        {/* Large Modal for Document Generator */}
        <Modal
          open={modalType === "add"}
          title="Document Generator"
          onClose={() => setModalType(null)}
          width="95vw" // Make it wide for side-by-side view
          style={{maxWidth: '1400px'}}
        >
          <AgreementAddForm onSubmit={handleAdd} onCancel={() => setModalType(null)} />
        </Modal>

        <Modal
          open={modalType === "edit"}
          title="Edit Document"
          onClose={() => setModalType(null)}
          width="95vw"
          style={{maxWidth: '1400px'}}
        >
          <AgreementEditForm
            initialData={selected}
            onSubmit={handleEdit}
            onCancel={() => setModalType(null)}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}