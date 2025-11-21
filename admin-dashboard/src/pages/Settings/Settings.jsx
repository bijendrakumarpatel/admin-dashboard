import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import "./Settings.css";

export default function Settings() {
  const [profile, setProfile] = useState({
    companyName: "",
    gst: "",
    address: "",
    phone: "",
  });

  const change = (key) => (e) =>
    setProfile({ ...profile, [key]: e.target.value });

  return (
    <AdminLayout title="Settings">
      <div className="settings-page">
        <h2 style={{ fontSize: 18 }}>Company Profile</h2>

        <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            Company Name
            <input value={profile.companyName} onChange={change("companyName")} />
          </label>

          <label>
            GST Number
            <input value={profile.gst} onChange={change("gst")} />
          </label>

          <label>
            Phone
            <input value={profile.phone} onChange={change("phone")} />
          </label>

          <label>
            Address
            <textarea value={profile.address} onChange={change("address")} rows={2}></textarea>
          </label>

          <button style={{ marginTop: 12, padding: "8px 14px" }}>Save Settings</button>
        </div>
      </div>
    </AdminLayout>
  );
}
