import React from "react";
import "./DataTable.css";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyText = "No records found.",
}) {
  // ---------------------------------------------------------
  // CRITICAL FIX: Crash Prevention
  // ---------------------------------------------------------
  // If the backend fails and returns an object (e.g. { message: "Error" })
  // instead of an array, data.map() will crash React.
  // This line forces 'safeData' to always be an array.
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="datatable">
      <div className="datatable__wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={col.key || col.accessor || index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="datatable__loading">
                  Loading...
                </td>
              </tr>
            ) : safeData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="datatable__empty">
                  {emptyText}
                </td>
              </tr>
            ) : (
              safeData.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map((col, colIndex) => (
                    <td key={col.key || col.accessor || colIndex}>
                      {/* Render Logic:
                         1. If col.render() exists, use it (for buttons, badges, etc.)
                         2. Otherwise, display the text value from row[col.accessor]
                      */}
                      {col.render
                        ? col.render(row)
                        : row[col.accessor] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}