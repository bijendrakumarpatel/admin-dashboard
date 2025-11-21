import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";
import ProductAddForm from "./ProductAddForm";
import ProductEditForm from "./ProductEditForm";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // "add" | "edit"
  const [selected, setSelected] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (form) => {
    try {
      await createProduct(form);
      setModalType(null);
      await fetchProducts();
    } catch (err) {
      console.error("Create product failed:", err);
    }
  };

  const handleEdit = async (form) => {
    try {
      await updateProduct(selected.id, form);
      setModalType(null);
      setSelected(null);
      await fetchProducts();
    } catch (err) {
      console.error("Update product failed:", err);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete product "${row.name}"?`)) return;
    try {
      await deleteProduct(row.id);
      await fetchProducts();
    } catch (err) {
      console.error("Delete product failed:", err);
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "SKU", accessor: "sku" },
    { header: "Price", accessor: "price" },
    { header: "Stock", accessor: "stock" },
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
    <AdminLayout title="Products">
      <div className="products-page">
        <div className="products-page__header">
          <div className="products-page__title">Products</div>
          <div className="products-page__actions">
            <button
              className="products-page__button"
              onClick={() => setModalType("add")}
            >
              + New Product
            </button>
          </div>
        </div>

        {loading ? (
          <Loader size={40} />
        ) : (
          <DataTable columns={columns} data={products} />
        )}

        <Modal
          open={modalType === "add"}
          title="Add Product"
          onClose={() => setModalType(null)}
        >
          <ProductAddForm
            onSubmit={handleAdd}
            onCancel={() => setModalType(null)}
          />
        </Modal>

        <Modal
          open={modalType === "edit"}
          title="Edit Product"
          onClose={() => {
            setModalType(null);
            setSelected(null);
          }}
        >
          <ProductEditForm
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
