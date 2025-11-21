import React, { useState, useRef } from "react";
import "./Agreements.css";

export default function AgreementEditForm({ initialData, onSubmit, onCancel }) {
  // --- 1. DATA RESTORATION LOGIC ---
  // This function safely extracts the complex document data stored in the 'remarks' JSON string
  const parseMeta = (data) => {
    const defaultItems = [{ id: 1, desc: "Item 1", qty: 1, rate: 0, unit: "" }];
    
    try {
      // Try to parse the JSON stored in remarks
      const parsed = data.remarks ? JSON.parse(data.remarks) : {};
      
      return {
        template: parsed.template || "lease",
        
        // Merge parsed fields with defaults to prevent undefined errors
        party2Name: parsed.party2Name || parsed.partyName || "Client Name",
        party2Address: parsed.party2Address || parsed.address || "",
        party2Gstin: parsed.party2Gstin || "",
        party2Mobile: parsed.party2Mobile || "",
        party2Aadhaar: parsed.party2Aadhaar || "",
        party2Pan: parsed.party2Pan || "",
        
        equipmentName: parsed.equipmentName || parsed.subject || "",
        remarks: parsed.remarks || parsed.note || "", // The actual text content
        
        // Paddy Specifics
        village: parsed.village || "",
        vehicleNo: parsed.vehicleNo || "",
        godown: parsed.godown || "",
        harvestDate: parsed.harvestDate || "",
        weighbridgeSlip: parsed.weighbridgeSlip || "",
        
        // Deductions
        deductionMoisture: parsed.deductionMoisture || "0",
        deductionTransport: parsed.deductionTransport || "0",
        deductionPackaging: parsed.deductionPackaging || "0",
        deductionOther: parsed.deductionOther || "0",
        
        // Banking
        bankMode: parsed.bankMode || "RTGS/NEFT",
        bankDetails: parsed.bankDetails || "",
        
        // Tables
        items: Array.isArray(parsed.items) ? parsed.items : defaultItems
      };
    } catch (e) {
      // Fallback for legacy records where remarks might just be a plain string
      return {
        template: "lease",
        party2Name: "Client",
        party2Address: "",
        equipmentName: "Agreement Subject",
        remarks: data.remarks || "",
        items: defaultItems,
        // Set defaults for others
        village: "", vehicleNo: "", godown: "", harvestDate: "", weighbridgeSlip: "",
        deductionMoisture: "0", deductionTransport: "0", deductionPackaging: "0", deductionOther: "0",
        party2Gstin: "", party2Mobile: "", party2Aadhaar: "", party2Pan: "",
        bankMode: "RTGS/NEFT", bankDetails: ""
      };
    }
  };

  // Initialize State
  const meta = parseMeta(initialData);
  const [template, setTemplate] = useState(meta.template);
  const [formData, setFormData] = useState({
    customerId: initialData.customerId || "",
    startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
    endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
    amount: initialData.amount || "",
    ...meta 
  });

  const previewRef = useRef();

  // --- CONSTANTS ---
  const TEMPLATES = [
    { group: "Procurement & Sales", options: [
        { id: "paddy_receipt", label: "Paddy Procurement Receipt" },
        { id: "professional_invoice", label: "Professional GST Invoice" },
        { id: "product_acceptance", label: "Product Acceptance Receipt" },
    ]},
    { group: "Banking & Payments", options: [
        { id: "rtgs_template", label: "RTGS/NEFT Request Form" },
        { id: "payment", label: "Payment Receipt" },
    ]},
    { group: "Agreements", options: [
        { id: "lease", label: "Equipment Lease Agreement" },
        { id: "basic", label: "MOU (Memorandum of Understanding)" },
        { id: "retail", label: "Retail Partnership Agreement" },
        { id: "distribution", label: "Distribution Agreement" },
        { id: "staff_nda", label: "Staff NDA" },
    ]},
    { group: "Official Letters", options: [
        { id: "ceo_letter", label: "CEO Letter (Draft)" },
        { id: "blank_template", label: "Blank Business Letter" },
        { id: "notice_template", label: "Official Company Notice" },
    ]}
  ];

  // --- HELPERS ---
  const numberToWords = (num) => {
    if (!num) return "";
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(num)
            .replace("₹", "Rupees ") + " Only";
    } catch (e) { return num + " Only"; }
  };

  const calculateTotal = () => {
    if (template === 'rtgs_template') {
      return formData.items.reduce((acc, item) => acc + (Number(item.rate) || 0), 0);
    }
    if (template === 'paddy_receipt') {
       return formData.items.reduce((acc, item) => acc + ((Number(item.unit) || 0) * (Number(item.rate) || 0)), 0);
    }
    return formData.items.reduce((acc, item) => acc + ((Number(item.qty) || 0) * (Number(item.rate) || 0)), 0);
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), desc: "", qty: 1, rate: 0, unit: "" }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handlePrint = () => {
    const content = previewRef.current.innerHTML;
    const printWindow = window.open("", "", "height=900,width=850");
    printWindow.document.write("<html><head><title>Print Document</title>");
    printWindow.document.write(`
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=EB+Garamond:wght@400;700&display=swap');
        body { font-family: 'EB Garamond', serif; padding: 20px; color: #000; -webkit-print-color-adjust: exact; }
        .doc-header { display: flex; justify-content: space-between; border-bottom: 3px double #000; padding-bottom: 15px; margin-bottom: 20px; }
        .doc-title { text-align: center; font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 900; text-decoration: underline; margin: 15px 0; color: #1e3a8a; text-transform: uppercase; }
        .doc-section-title { font-family: 'Inter', sans-serif; font-weight: 700; border-bottom: 1px solid #ccc; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; font-size: 12px; color: #047857; }
        .doc-text { font-size: 12pt; line-height: 1.5; text-align: justify; margin-bottom: 10px; }
        .doc-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11pt; font-family: 'Inter', sans-serif; }
        .doc-table th, .doc-table td { border: 1px solid #000; padding: 6px; }
        .doc-table th { background-color: #f0f0f0 !important; font-weight: bold; text-align: center; }
        .doc-table td.right { text-align: right; }
        .doc-grid { display: flex; gap: 20px; margin-bottom: 15px; }
        .doc-box { flex: 1; border: 1px solid #000; padding: 10px; font-family: 'Inter', sans-serif; font-size: 10pt; }
        .doc-box-title { font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 5px; }
        .doc-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .doc-signature-row { display: flex; justify-content: space-between; margin-top: 60px; page-break-inside: avoid; }
        .doc-signature-block { width: 40%; text-align: center; }
        .sig-line { border-top: 1px solid #000; margin-top: 40px; padding-top: 5px; font-weight: bold; font-family: 'Inter', sans-serif; font-size: 11px; }
      </style>
    `);
    printWindow.document.write("</head><body>");
    printWindow.document.write(content);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmt = calculateTotal();
    // Repackage everything into JSON so no data is lost on next edit
    const payload = {
      customerId: Number(formData.customerId) || 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      amount: totalAmt,
      remarks: JSON.stringify({ ...formData, totalAmount: totalAmt, template }),
      status: "Active"
    };
    onSubmit && onSubmit(payload);
  };

  // --- PREVIEW COMPONENTS ---
  const Header = () => (
    <div className="doc-header">
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div style={{ width: "60px", height: "60px", border: "2px solid #047857", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#047857", fontWeight: "bold", fontSize: "10px" }}>LOGO</div>
        <div>
          <h2 style={{ margin: 0, fontFamily: "Inter", color: "#047857", fontSize: "24px", fontWeight: "900" }}>LAXMI JEE MINI RICE MILL</h2>
          <p style={{ margin: 0, fontSize: "11px", fontFamily: "Inter" }}>Maudihan, Nokha (Rohtas), Bihar - 802217</p>
          <p style={{ margin: 0, fontSize: "11px", fontFamily: "Inter" }}>GSTIN: 10CEAPS3984M2Z5 | Ph: +91 9573501203</p>
        </div>
      </div>
      <div style={{ textAlign: "right", fontSize: "11px", fontFamily: "Inter" }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#555' }}>DOC ID: {initialData.id}</p>
        <p style={{ margin: 0 }}>Email: laxmijiricemil@gmail.com</p>
        <p style={{ margin: 0, marginTop: "4px" }}><strong>Date:</strong> {new Date(formData.startDate).toLocaleDateString("en-IN")}</p>
      </div>
    </div>
  );

  const Signatures = ({ label = "Second Party" }) => (
    <div className="doc-signature-row">
      <div className="doc-signature-block">
        <div className="sig-line">{formData.party2Name}</div>
        <p style={{ fontSize: "10px", margin: 0 }}>({label})</p>
      </div>
      <div className="doc-signature-block">
        <div className="sig-line">Laxmi Jee Mini Rice Mill</div>
        <p style={{ fontSize: "10px", margin: 0 }}>(Authorized Signatory & Stamp)</p>
      </div>
    </div>
  );

  const ItemTable = ({ cols }) => (
    <table className="doc-table">
      <thead>
        <tr>
          <th style={{ width: "40px" }}>Sl</th>
          {cols.map(c => <th key={c}>{c}</th>)}
          <th style={{ width: "100px" }}>Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {formData.items.map((item, i) => (
          <tr key={i}>
            <td style={{textAlign: 'center'}}>{i + 1}</td>
            {cols.map(c => {
              let val = "";
              if (["Description", "Variety", "Beneficiary"].includes(c)) val = item.desc;
              else if (["Qty", "Bags", "A/C No"].includes(c)) val = item.qty;
              else if (["Rate", "Weight", "Amount"].includes(c)) val = item.rate;
              else if (["Unit", "Gross Wt", "IFSC"].includes(c)) val = item.unit;
              return <td key={c} style={{textAlign: c.includes('Desc') ? 'left' : 'center'}}>{val}</td>
            })}
            <td className="right">
              {template === 'rtgs_template' ? Number(item.rate).toFixed(2) : (Number(item.qty) * Number(item.rate)).toFixed(2)}
            </td>
          </tr>
        ))}
        <tr style={{ backgroundColor: "#f3f4f6" }}>
          <td colSpan={cols.length + 1} className="right" style={{ fontWeight: "bold" }}>TOTAL</td>
          <td className="right" style={{ fontWeight: "bold" }}>₹{calculateTotal().toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
        </tr>
      </tbody>
    </table>
  );

  // --- PREVIEW RENDER LOGIC ---
  const renderContent = () => {
    switch (template) {
      case "paddy_receipt":
        const grossVal = calculateTotal();
        const totalDed = Number(formData.deductionMoisture) + Number(formData.deductionTransport) + Number(formData.deductionPackaging) + Number(formData.deductionOther);
        const netPayable = grossVal - totalDed;
        const totalWeight = formData.items.reduce((acc, item) => acc + Number(item.unit), 0);

        return (
          <>
            <Header />
            <div className="doc-title">PADDY PROCUREMENT RECEIPT</div>
            <p style={{textAlign:'center', fontSize:'10px', marginTop:'-10px'}}>Procurement from local farmer (RCM Applicable)</p>
            
            <div className="doc-grid">
              <div className="doc-box">
                <div className="doc-box-title">Supplier (Farmer) Details</div>
                <div className="doc-row"><span>Name:</span> <strong>{formData.party2Name}</strong></div>
                <div className="doc-row"><span>Village:</span> <span>{formData.village}</span></div>
                <div className="doc-row"><span>Mobile:</span> <span>{formData.party2Mobile}</span></div>
                <div className="doc-row"><span>Aadhaar:</span> <span>{formData.party2Aadhaar}</span></div>
                <div className="doc-row"><span>PAN:</span> <span>{formData.party2Pan}</span></div>
              </div>
              <div className="doc-box">
                <div className="doc-box-title">Procurement Details</div>
                <div className="doc-row"><span>Receipt No:</span> <span>PR-{initialData.id}</span></div>
                <div className="doc-row"><span>Godown:</span> <span>{formData.godown}</span></div>
                <div className="doc-row"><span>Harvest Date:</span> <span>{formData.harvestDate}</span></div>
                <div className="doc-row"><span>Weighbridge:</span> <span>{formData.weighbridgeSlip}</span></div>
                <div className="doc-row"><span>Net Weight:</span> <strong>{totalWeight.toFixed(2)} KG</strong></div>
              </div>
            </div>

            <table className="doc-table">
              <thead>
                <tr><th>S/No</th><th>Variety/Grade</th><th>Lot ID</th><th>Vehicle</th><th>Bags</th><th>Gross Wt</th><th>Rate</th><th>Value (₹)</th></tr>
              </thead>
              <tbody>
                {formData.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{textAlign:'center'}}>{i + 1}</td>
                    <td>{item.desc}</td>
                    <td style={{textAlign:'center'}}>{item.lot}</td>
                    <td style={{textAlign:'center'}}>{item.vehicle}</td>
                    <td style={{textAlign:'center'}}>{item.bags}</td>
                    <td style={{textAlign:'right'}}>{Number(item.unit).toFixed(2)}</td>
                    <td style={{textAlign:'right'}}>{item.rate}</td>
                    <td className="right">{(Number(item.unit) * Number(item.rate)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <div style={{width: '300px', fontSize: '11px', border:'1px solid #000', padding:'5px'}}>
                <div className="doc-row"><span>Gross Value:</span> <strong>{grossVal.toFixed(2)}</strong></div>
                <div className="doc-row" style={{color:'red'}}><span>(-) Moisture Ded:</span> <span>{Number(formData.deductionMoisture).toFixed(2)}</span></div>
                <div className="doc-row" style={{color:'red'}}><span>(-) Transport:</span> <span>{Number(formData.deductionTransport).toFixed(2)}</span></div>
                <div className="doc-row" style={{color:'red'}}><span>(-) Packaging:</span> <span>{Number(formData.deductionPackaging).toFixed(2)}</span></div>
                <div className="doc-row" style={{color:'red'}}><span>(-) Other:</span> <span>{Number(formData.deductionOther).toFixed(2)}</span></div>
                <div className="doc-row" style={{borderTop:'1px solid #000', paddingTop:'5px', marginTop:'5px', fontSize:'12px'}}>
                    <span>FINAL PAYABLE:</span> <strong>₹{netPayable.toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div style={{marginTop:'10px', fontSize:'11px'}}><strong>Amount in Words:</strong> {numberToWords(netPayable)}</div>
            <div className="doc-box" style={{marginTop:'10px', fontSize:'10px'}}>
                <div className="doc-box-title">Payment & Declaration</div>
                <p style={{margin:'2px 0'}}><strong>Details:</strong> {formData.bankMode} | {formData.bankDetails}</p>
                <p style={{margin:'2px 0'}}><strong>Declaration:</strong> The supplier confirms the goods are their produce, free from encumbrances. E. & O. E.</p>
            </div>
            <Signatures label="Farmer Signature" />
          </>
        );

      case "professional_invoice":
        return (
          <>
            <Header />
            <div className="doc-title">TAX INVOICE</div>
            <div className="doc-grid">
              <div className="doc-box">
                <div className="doc-box-title">Billed To</div>
                <div className="doc-row"><span>Name:</span> <strong>{formData.party2Name}</strong></div>
                <div className="doc-row"><span>Address:</span> <span>{formData.party2Address}</span></div>
                <div className="doc-row"><span>GSTIN:</span> <span>{formData.party2Gstin}</span></div>
                <div className="doc-row"><span>Mobile:</span> <span>{formData.party2Mobile}</span></div>
              </div>
              <div className="doc-box">
                <div className="doc-box-title">Invoice Details</div>
                <div className="doc-row"><span>Invoice No:</span> <strong>INV-{new Date().getFullYear()}-{initialData.id}</strong></div>
                <div className="doc-row"><span>Date:</span> <span>{new Date(formData.startDate).toLocaleDateString('en-IN')}</span></div>
                <div className="doc-row"><span>State Code:</span> <span>10 (Bihar)</span></div>
                <div className="doc-row"><span>Vehicle No:</span> <span>{formData.vehicleNo}</span></div>
              </div>
            </div>
            <ItemTable cols={["Description", "HSN", "Qty", "Rate"]} />
            <div style={{ marginTop: "20px", fontSize: "11px" }}><strong>Amount in Words:</strong> {numberToWords(calculateTotal())}</div>
            <Signatures label="Receiver Signature" />
          </>
        );

      case "rtgs_template":
        return (
          <>
            <Header />
            <div className="doc-title">RTGS / NEFT REQUEST FORM</div>
            <div className="doc-box" style={{marginBottom: '20px'}}>
                <div className="doc-box-title">Sender Details (Debit From)</div>
                <div className="doc-row"><span>Account Name:</span> <strong>LAXMI JEE MINI RICE MILL</strong></div>
                <div className="doc-row"><span>Account No:</span> <strong>00080500001511</strong></div>
                <div className="doc-row"><span>Bank & Branch:</span> <span>Bank of Baroda, Nokha</span></div>
            </div>
            <div className="doc-section-title">BENEFICIARY DETAILS</div>
            <ItemTable cols={["Beneficiary", "A/C No", "IFSC"]} />
            <div style={{marginTop: '20px', fontSize: '11px'}}>
                <p>Please remit the sum of <strong>₹{calculateTotal().toLocaleString('en-IN')}</strong> as per details above.</p>
                <p><strong>Total Amount in Words:</strong> {numberToWords(calculateTotal())}</p>
            </div>
            <Signatures label="Bank Official" />
          </>
        );

      // AGREEMENTS
      case "lease":
      case "basic":
      case "retail":
      case "distribution":
      case "staff_nda":
        const titles = {
            lease: "EQUIPMENT LEASE AGREEMENT",
            basic: "MEMORANDUM OF UNDERSTANDING",
            retail: "RETAIL PARTNERSHIP AGREEMENT",
            distribution: "DISTRIBUTION AGREEMENT",
            staff_nda: "STAFF NON-DISCLOSURE AGREEMENT"
        };
        return (
          <>
            <Header />
            <div className="doc-title">{titles[template]}</div>
            <div className="doc-section-title">I. PARTIES</div>
            <p className="doc-text">This Agreement is made on <strong>{new Date(formData.startDate).toLocaleDateString("en-IN")}</strong> between <strong>Laxmi Jee Mini Rice Mill</strong> (First Party) and <strong>{formData.party2Name}</strong> (Second Party).</p>
            <div className="doc-section-title">II. SUBJECT MATTER</div>
            <p className="doc-text">
              {template === 'lease' && `The First Party agrees to lease the following equipment to the Second Party: ${formData.equipmentName}.`}
              {template === 'staff_nda' && `The Second Party (Employee) agrees to maintain confidentiality regarding ${formData.equipmentName}.`}
              {['basic','retail','distribution'].includes(template) && `The parties agree to collaborate on: ${formData.equipmentName}. ${formData.remarks}`}
            </p>
            <div className="doc-section-title">III. TERMS</div>
            <p className="doc-text">
              1. <strong>Duration:</strong> Valid until {formData.endDate || "Further Notice"}.<br/>
              2. <strong>Consideration:</strong> {formData.amount ? `₹${formData.amount}` : "As per mutual understanding"}.<br/>
              3. <strong>Details:</strong> {formData.remarks}
            </p>
            <Signatures label={template === 'staff_nda' ? "Employee" : "Second Party"} />
          </>
        );

      default: // LETTERS
        const lTitles = { payment: "PAYMENT RECEIPT", product_acceptance: "PRODUCT ACCEPTANCE NOTE", ceo_letter: "MESSAGE FROM CEO", notice_template: "OFFICIAL NOTICE", blank_template: "LETTER" };
        return (
            <>
                <Header />
                <div className="doc-title">{lTitles[template]}</div>
                <div style={{marginTop: '30px', minHeight: '400px'}}>
                    {template !== 'notice_template' && (
                        <div style={{marginBottom:'20px'}}>
                            <p className="doc-text"><strong>To:</strong> {formData.party2Name}, {formData.party2Address}</p>
                        </div>
                    )}
                    <p className="doc-text"><strong>Subject:</strong> {formData.equipmentName || "General Business Matter"}</p>
                    <hr style={{borderTop:'1px solid #eee', margin:'10px 0'}}/>
                    <div style={{marginTop: '20px', lineHeight: '1.8'}}>
                        {template === 'payment' && <p className="doc-text">Received with thanks from <strong>{formData.party2Name}</strong> the sum of <strong>₹{formData.amount}</strong> via {formData.bankMode} regarding {formData.remarks}.</p>}
                        {['ceo_letter', 'blank_template', 'notice_template'].includes(template) && (<p className="doc-text">{formData.remarks || "[Body Content]"}</p>)}
                    </div>
                </div>
                <Signatures label={template === 'notice_template' ? "Administration" : "Recipient"} />
            </>
        );
    }
  };

  return (
    <div className="agreement-generator-container">
      <div className="generator-controls">
        <h3>Edit Document #{initialData.id}</h3>
        <form onSubmit={handleSubmit} className="control-form">
          
          <div className="form-section">
            <div className="form-group">
                <label>Document Type (Locked)</label>
                <select name="template" value={template} disabled style={{backgroundColor: '#f1f5f9', cursor: 'not-allowed'}}>
                    {TEMPLATES.map((group, i) => (
                        <optgroup key={i} label={group.group}>
                            {group.options.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                        </optgroup>
                    ))}
                </select>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="form-section">
            <div className="form-section-title">Basic Info</div>
            <div className="form-row">
                <div className="form-group"><label>Cust ID</label><input type="number" name="customerId" value={formData.customerId} onChange={handleChange} /></div>
                <div className="form-group"><label>Date</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} /></div>
            </div>
          </div>

          {/* PARTY DETAILS */}
          {template !== 'notice_template' && (
            <div className="form-section">
                <div className="form-section-title">Party Details</div>
                <div className="form-group"><label>Name / Farmer</label><input type="text" name="party2Name" value={formData.party2Name} onChange={handleChange} /></div>
                <div className="form-group"><label>{template === 'paddy_receipt' ? 'Village' : 'Address'}</label><input type="text" name={template === 'paddy_receipt' ? 'village' : 'party2Address'} value={template === 'paddy_receipt' ? formData.village : formData.party2Address} onChange={handleChange} /></div>
                
                {template === 'paddy_receipt' && (
                    <div className="form-row">
                        <div className="form-group"><label>Mobile</label><input type="text" name="party2Mobile" value={formData.party2Mobile} onChange={handleChange} /></div>
                        <div className="form-group"><label>Aadhaar</label><input type="text" name="party2Aadhaar" value={formData.party2Aadhaar} onChange={handleChange} /></div>
                    </div>
                )}
                {template === 'professional_invoice' && (
                    <div className="form-group"><label>GSTIN</label><input type="text" name="party2Gstin" value={formData.party2Gstin} onChange={handleChange} /></div>
                )}
            </div>
          )}

          {/* SPECIFICS */}
          <div className="form-section">
            <div className="form-section-title">Specifics</div>
            <div className="form-group">
                <label>{template === 'rtgs_template' ? 'Sender Bank' : template === 'paddy_receipt' ? 'Vehicle No' : 'Subject / Equipment'}</label>
                <input type="text" name={template === 'paddy_receipt' ? 'vehicleNo' : 'equipmentName'} value={template === 'paddy_receipt' ? formData.vehicleNo : formData.equipmentName} onChange={handleChange} />
            </div>
            {template === 'paddy_receipt' && (
                <div className="form-row">
                    <div className="form-group"><label>Godown</label><input type="text" name="godown" value={formData.godown} onChange={handleChange} /></div>
                    <div className="form-group"><label>Weighbridge Slip</label><input type="text" name="weighbridgeSlip" value={formData.weighbridgeSlip} onChange={handleChange} /></div>
                </div>
            )}
          </div>

          {/* DYNAMIC ITEMS */}
          {['professional_invoice', 'paddy_receipt', 'rtgs_template'].includes(template) && (
            <div className="form-section">
                <div className="form-section-title">Items / Rows</div>
                {formData.items.map((item, index) => (
                    <div key={index} className="doc-box" style={{marginBottom:'10px', background:'#fff', border:'1px solid #e5e7eb'}}>
                        <div className="form-group"><input placeholder={template === 'rtgs_template' ? 'Beneficiary Name' : 'Description/Variety'} value={item.desc} onChange={(e) => handleItemChange(index, 'desc', e.target.value)} /></div>
                        <div className="form-row">
                            {template === 'paddy_receipt' && <div className="form-group"><input placeholder="Lot ID" value={item.lot} onChange={(e) => handleItemChange(index, 'lot', e.target.value)} /></div>}
                            <div className="form-group"><input type="number" placeholder={template === 'rtgs_template' ? 'A/C No' : 'Qty/Bags'} value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} /></div>
                            <div className="form-group"><input type="number" placeholder={template === 'rtgs_template' ? 'Amount' : 'Rate'} value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} /></div>
                        </div>
                        {(template === 'paddy_receipt' || template === 'rtgs_template') && (
                            <div className="form-group"><input placeholder={template === 'paddy_receipt' ? "Gross Weight" : "IFSC Code"} value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} /></div>
                        )}
                        <button type="button" className="btn-danger" onClick={() => removeItem(index)} style={{marginTop:'5px'}}>Remove Row</button>
                    </div>
                ))}
                <button type="button" className="btn-add" onClick={addItem}>+ Add Row</button>
            </div>
          )}

          {/* PADDY DEDUCTIONS */}
          {template === 'paddy_receipt' && (
            <div className="form-section">
                <div className="form-section-title">Deductions</div>
                <div className="form-row">
                    <div className="form-group"><label>Moisture</label><input type="number" name="deductionMoisture" value={formData.deductionMoisture} onChange={handleChange} /></div>
                    <div className="form-group"><label>Transport</label><input type="number" name="deductionTransport" value={formData.deductionTransport} onChange={handleChange} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Packaging</label><input type="number" name="deductionPackaging" value={formData.deductionPackaging} onChange={handleChange} /></div>
                    <div className="form-group"><label>Other</label><input type="number" name="deductionOther" value={formData.deductionOther} onChange={handleChange} /></div>
                </div>
            </div>
          )}

          {!['professional_invoice', 'paddy_receipt', 'rtgs_template'].includes(template) && (
             <div className="form-group"><label>Amount (₹)</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} /></div>
          )}
          
          <div className="form-group"><label>Remarks / Notes</label><textarea name="remarks" rows={3} value={formData.remarks} onChange={handleChange} /></div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
            <button type="submit" className="btn-primary">Update Record</button>
          </div>
        </form>
      </div>

      <div className="generator-preview-pane">
        <div className="a4-paper" ref={previewRef}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}