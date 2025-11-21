import React, { useState, useRef } from "react";
import "./Agreements.css";

export default function AgreementAddForm({ onSubmit, onCancel }) {
  // --- STATE ---
  const [template, setTemplate] = useState("paddy_receipt"); // Default to Paddy as requested
  
  // Comprehensive State for ALL Document Types
  const [formData, setFormData] = useState({
    // System / Common
    customerId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    
    // Party / Recipient Details
    party2Name: "Ramesh Singh", // Default from PDF example
    party2Address: "Bela Gaon",
    party2Mobile: "98765 43210",
    party2Gstin: "",
    party2Aadhaar: "XXXX XXXX 1234",
    party2Pan: "ABCDE1234F",
    
    // Specifics (Agreements/Letters)
    equipmentName: "Rice Polishing Machine", // Subject/Equipment
    remarks: "Standard terms and conditions apply.",
    
    // Paddy Specifics
    godown: "Godown 3, Gate A",
    harvestDate: "2025-09-15",
    weighbridgeSlip: "WB/00145",
    vehicleNo: "BR-01-T-1234",
    
    // Deductions (Paddy)
    deductionMoisture: "2000",
    deductionTransport: "1000",
    deductionPackaging: "500",
    deductionOther: "300",
    
    // Bank Details (RTGS / Payment Info)
    bankMode: "RTGS/NEFT",
    bankDetails: "HDFC Bank A/C: 50100XXXXX | IFSC: HDFC0001234",
    
    // Items Array (Used for Invoices, Paddy Receipts, RTGS)
    items: [
      { id: 1, desc: "Sona Masoori", lot: "LOT-2509A", vehicle: "BR01 T 1234", bags: 50, unit: 7850, rate: 22 },
      { id: 2, desc: "Basmati Paddy", lot: "LOT-2509B", vehicle: "CG04 X 5678", bags: 30, unit: 4500, rate: 28.50 }
    ],
    
    // Generic Amount (for simple receipts/leases)
    amount: "" 
  });

  const previewRef = useRef();

  // --- TEMPLATE CONSTANTS ---
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

  // --- HELPER FUNCTIONS ---
  const numberToWords = (num) => {
    if (!num) return "";
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(num)
            .replace("₹", "Rupees ") + " Only";
    } catch (e) { return num + " Only"; }
  };

  const calculateTotal = () => {
    // RTGS: Rate is used as 'Amount'
    if (template === 'rtgs_template') {
      return formData.items.reduce((acc, item) => acc + (Number(item.rate) || 0), 0);
    }
    // Invoice/Paddy: Qty * Rate or Unit(Weight) * Rate
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
      items: [...prev.items, { id: Date.now(), desc: "", lot: "", vehicle: "", bags: 0, qty: 1, rate: 0, unit: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
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
        .doc-title { text-align: center; font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 900; text-decoration: underline; margin: 15px 0; color: #104e8b; text-transform: uppercase; }
        .doc-section-title { font-family: 'Inter', sans-serif; font-weight: 700; border-bottom: 1px solid #ccc; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; font-size: 12px; color: #047857; }
        .doc-text { font-size: 12px; line-height: 1.5; text-align: justify; margin-bottom: 8px; }
        .doc-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; font-family: 'Inter', sans-serif; }
        .doc-table th, .doc-table td { border: 1px solid #000; padding: 6px; }
        .doc-table th { background-color: #f0f0f0 !important; font-weight: bold; text-align: center; }
        .doc-table td.right { text-align: right; }
        .doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
        .doc-box { border: 1px solid #000; padding: 8px; font-family: 'Inter', sans-serif; font-size: 10pt; }
        .doc-box-title { font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 4px; background: #f9fafb; }
        .doc-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
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
    // Store complex data in remarks as JSON string for retrieval in Edit Mode
    const payload = {
      customerId: Number(formData.customerId) || 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      amount: totalAmt || Number(formData.amount) || 0,
      remarks: JSON.stringify({ ...formData, totalAmount: totalAmt, template }),
      status: "Active"
    };
    onSubmit && onSubmit(payload);
  };

  // --- RENDER PREVIEW COMPONENTS ---

  const Header = () => (
    <div className="doc-header">
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Branding Logo Placeholder */}
        <div style={{ width: "60px", height: "60px", border: "2px solid #047857", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#047857", fontWeight: "bold", fontSize: "10px" }}>LOGO</div>
        <div>
          <h2 style={{ margin: 0, fontFamily: "Inter", color: "#047857", fontSize: "22px", fontWeight: "900" }}>LAXMI JEE MINI RICE MILL</h2>
          <p style={{ margin: 0, fontSize: "11px", fontFamily: "Inter" }}>Maudihan, Nokha (Rohtas), Bihar - 802217</p>
          <p style={{ margin: 0, fontSize: "11px", fontFamily: "Inter" }}>GSTIN: 10CEAPS3984M2Z5 | Ph: +91 9573501203</p>
        </div>
      </div>
      <div style={{ textAlign: "right", fontSize: "11px", fontFamily: "Inter" }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#555' }}>DOCUMENT ID: {Date.now().toString().slice(-6)}</p>
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

  // --- TEMPLATE RENDER LOGIC ---

  const renderContent = () => {
    switch (template) {
      // 1. PADDY PROCUREMENT RECEIPT (Matches PDF)
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
                <div className="doc-row"><span>Village:</span> <span>{formData.party2Address}</span></div>
                <div className="doc-row"><span>Mobile:</span> <span>{formData.party2Mobile}</span></div>
                <div className="doc-row"><span>Aadhaar:</span> <span>{formData.party2Aadhaar}</span></div>
                <div className="doc-row"><span>PAN:</span> <span>{formData.party2Pan}</span></div>
              </div>
              <div className="doc-box">
                <div className="doc-box-title">Procurement Details</div>
                <div className="doc-row"><span>Receipt No:</span> <span>PR-{Date.now().toString().slice(-4)}</span></div>
                <div className="doc-row"><span>Godown:</span> <span>{formData.godown}</span></div>
                <div className="doc-row"><span>Harvest Date:</span> <span>{formData.harvestDate}</span></div>
                <div className="doc-row"><span>Weighbridge:</span> <span>{formData.weighbridgeSlip}</span></div>
                <div className="doc-row"><span>Net Weight:</span> <strong>{totalWeight.toFixed(2)} KG</strong></div>
              </div>
            </div>

            <table className="doc-table">
              <thead>
                <tr>
                  <th>S/No</th><th>Variety/Grade</th><th>Lot ID</th><th>Vehicle</th><th>Bags</th><th>Gross Wt</th><th>Rate</th><th>Value (₹)</th>
                </tr>
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

            <div style={{marginTop:'10px', fontSize:'11px', fontWeight:'bold'}}>Payment Amount in Words:</div>
            <div style={{fontSize:'11px', fontStyle:'italic', marginBottom:'10px'}}>{numberToWords(netPayable)}</div>

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

            <div className="doc-box" style={{marginTop:'10px', fontSize:'10px'}}>
                <div className="doc-box-title">Payment & Declaration</div>
                <p style={{margin:'2px 0'}}><strong>Details:</strong> {formData.bankMode} | {formData.bankDetails}</p>
                <p style={{margin:'2px 0'}}><strong>Declaration:</strong> The supplier confirms the goods are their produce, free from encumbrances and accepted by buyer. E. & O. E.</p>
            </div>

            <Signatures label="Farmer Signature" />
          </>
        );

      // 2. PROFESSIONAL GST INVOICE
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
                <div className="doc-row"><span>Invoice No:</span> <strong>INV-{new Date().getFullYear()}-001</strong></div>
                <div className="doc-row"><span>Date:</span> <span>{new Date(formData.startDate).toLocaleDateString('en-IN')}</span></div>
                <div className="doc-row"><span>State Code:</span> <span>10 (Bihar)</span></div>
                <div className="doc-row"><span>Vehicle No:</span> <span>{formData.vehicleNo}</span></div>
              </div>
            </div>

            <table className="doc-table">
              <thead>
                <tr><th>Sl</th><th>Description</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Amount (₹)</th></tr>
              </thead>
              <tbody>
                {formData.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{textAlign:'center'}}>{i + 1}</td>
                    <td>{item.desc}</td>
                    <td style={{textAlign:'center'}}>1006</td>
                    <td style={{textAlign:'center'}}>{item.qty}</td>
                    <td style={{textAlign:'right'}}>{item.rate}</td>
                    <td className="right">{(Number(item.qty) * Number(item.rate)).toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{backgroundColor:'#f3f4f6'}}>
                    <td colSpan="5" className="right"><strong>Total</strong></td>
                    <td className="right"><strong>{calculateTotal().toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop:'20px', fontSize:'11px'}}>
                <strong>Amount in Words:</strong> {numberToWords(calculateTotal())}
            </div>
            <Signatures label="Receiver Signature" />
          </>
        );

      // 3. RTGS FORM
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
                <div className="doc-row"><span>Cheque No:</span> <span>_________</span></div>
            </div>
            
            <div className="doc-section-title">BENEFICIARY DETAILS (CREDIT TO)</div>
            <table className="doc-table">
              <thead><tr><th>Sl</th><th>Beneficiary Name</th><th>Account No</th><th>IFSC Code</th><th>Amount (₹)</th></tr></thead>
              <tbody>
                {formData.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{textAlign:'center'}}>{i+1}</td>
                    <td>{item.desc}</td>
                    <td style={{textAlign:'center'}}>{item.qty}</td>
                    <td style={{textAlign:'center'}}>{item.unit}</td>{/* using unit for IFSC */}
                    <td className="right">{Number(item.rate).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                    <td colSpan="4" className="right"><strong>TOTAL AMOUNT</strong></td>
                    <td className="right"><strong>{calculateTotal().toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
            <div style={{marginTop:'20px', fontSize:'11px'}}>
                Please remit the sum of <strong>₹{calculateTotal().toLocaleString('en-IN')}</strong> as per details above.<br/>
                <strong>Amount in Words:</strong> {numberToWords(calculateTotal())}
            </div>
            <Signatures label="Bank Official" />
          </>
        );

      // 4. AGREEMENTS (Lease, NDA, MOU, Retail, Distribution)
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
            <p className="doc-text">
              This Agreement is made on <strong>{new Date(formData.startDate).toLocaleDateString("en-IN")}</strong> between:
            </p>
            <p className="doc-text">
              <strong>1. Laxmi Jee Mini Rice Mill</strong>, Maudihan, Nokha (Hereinafter "First Party").<br/>
              <strong>2. {formData.party2Name}</strong>, {formData.party2Address} (Hereinafter "Second Party").
            </p>
            
            <div className="doc-section-title">II. SUBJECT MATTER</div>
            <p className="doc-text">
              {template === 'lease' && `The First Party agrees to lease the following equipment to the Second Party: ${formData.equipmentName}.`}
              {template === 'staff_nda' && `The Second Party (Employee) agrees to maintain confidentiality regarding ${formData.equipmentName} and company trade secrets.`}
              {['basic','retail','distribution'].includes(template) && `The parties agree to collaborate on: ${formData.equipmentName}. ${formData.remarks}`}
            </p>

            <div className="doc-section-title">III. TERMS & CONDITIONS</div>
            <p className="doc-text">
              1. <strong>Duration:</strong> This agreement is valid until {formData.endDate || "Further Notice"}.<br/>
              2. <strong>Consideration:</strong> {formData.amount ? `₹${formData.amount}` : "As per mutual understanding"}.<br/>
              3. <strong>Obligations:</strong> Both parties agree to adhere to the standard operating procedures of Laxmi Jee Mini Rice Mill.<br/>
              4. <strong>Termination:</strong> Either party may terminate with 30 days notice.
            </p>
            <Signatures label={template === 'staff_nda' ? "Employee" : "Second Party"} />
          </>
        );

      // 5. LETTERS & SIMPLE RECEIPTS
      default: 
        const lTitles = { payment: "PAYMENT RECEIPT", product_acceptance: "PRODUCT ACCEPTANCE NOTE", ceo_letter: "MESSAGE FROM CEO", notice_template: "OFFICIAL NOTICE", blank_template: "LETTER" };
        return (
            <>
                <Header />
                <div className="doc-title">{lTitles[template]}</div>
                <div style={{marginTop: '30px', minHeight: '400px'}}>
                    {template !== 'notice_template' && (
                        <div style={{marginBottom:'20px'}}>
                            <p className="doc-text"><strong>To:</strong> {formData.party2Name}</p>
                            <p className="doc-text">{formData.party2Address}</p>
                        </div>
                    )}
                    
                    <p className="doc-text"><strong>Subject:</strong> {formData.equipmentName || "General Business Matter"}</p>
                    <hr style={{borderTop:'1px solid #eee', margin:'10px 0'}}/>
                    
                    <div style={{marginTop: '20px', lineHeight: '1.8'}}>
                        {template === 'payment' && <p className="doc-text">Received with thanks from <strong>{formData.party2Name}</strong> the sum of <strong>₹{formData.amount}</strong> via {formData.bankMode} regarding {formData.remarks}.</p>}
                        
                        {template === 'product_acceptance' && <p className="doc-text">We hereby acknowledge the receipt of goods/services mentioned below in good order and condition:<br/><strong>{formData.remarks}</strong></p>}
                        
                        {['ceo_letter', 'blank_template'].includes(template) && (
                            <><p className="doc-text">Dear Sir/Madam,</p><p className="doc-text">{formData.remarks || "[Letter Body Content]"}</p></>
                        )}

                        {template === 'notice_template' && (
                            <div style={{textAlign:'center'}}>
                                <p className="doc-text" style={{fontWeight:'bold'}}>NOTICE TO ALL EMPLOYEES / PARTNERS</p>
                                <p className="doc-text" style={{textAlign:'justify'}}>{formData.remarks || "Important announcement content goes here..."}</p>
                            </div>
                        )}
                    </div>
                </div>
                <Signatures label={template === 'notice_template' ? "Administration" : "Recipient"} />
            </>
        );
    }
  };

  // --- UI RETURN ---
  return (
    <div className="agreement-generator-container">
      {/* LEFT CONTROLS */}
      <div className="generator-controls">
        <h3>Document Generator</h3>
        <form onSubmit={handleSubmit} className="control-form">
          
          {/* 1. Template Select */}
          <div className="form-group">
            <label>Select Document Template</label>
            <select name="template" value={template} onChange={(e) => setTemplate(e.target.value)}>
                {TEMPLATES.map((group, i) => (
                    <optgroup key={i} label={group.group}>
                        {group.options.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                    </optgroup>
                ))}
            </select>
          </div>

          {/* 2. Basic Info */}
          <div className="form-section-title">Basic Info</div>
          <div className="form-row">
            <div className="form-group"><label>Cust ID</label><input type="number" name="customerId" value={formData.customerId} onChange={handleChange} /></div>
            <div className="form-group"><label>Date</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} /></div>
          </div>

          {/* 3. Party Details (Hide for Notice) */}
          {template !== 'notice_template' && (
            <>
                <div className="form-section-title">Party / Recipient</div>
                <div className="form-group"><label>Name / Farmer</label><input type="text" name="party2Name" value={formData.party2Name} onChange={handleChange} /></div>
                <div className="form-group"><label>{template === 'paddy_receipt' ? 'Village' : 'Address'}</label><input type="text" name="party2Address" value={formData.party2Address} onChange={handleChange} /></div>
                
                {template === 'paddy_receipt' && (
                    <div className="form-row">
                        <div className="form-group"><label>Mobile</label><input type="text" name="party2Mobile" value={formData.party2Mobile} onChange={handleChange} /></div>
                        <div className="form-group"><label>Aadhaar</label><input type="text" name="party2Aadhaar" value={formData.party2Aadhaar} onChange={handleChange} /></div>
                    </div>
                )}
                {template === 'professional_invoice' && (
                    <div className="form-group"><label>GSTIN</label><input type="text" name="party2Gstin" value={formData.party2Gstin} onChange={handleChange} /></div>
                )}
            </>
          )}

          {/* 4. Specifics */}
          <div className="form-section-title">Document Specifics</div>
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

          {/* 5. Dynamic Items Table */}
          {['professional_invoice', 'paddy_receipt', 'rtgs_template'].includes(template) && (
            <div className="form-section">
                <div className="form-section-title">Items / Rows</div>
                {formData.items.map((item, index) => (
                    <div key={index} className="doc-box" style={{marginBottom:'10px', background:'#f8fafc'}}>
                        <div className="form-group"><input placeholder={template === 'rtgs_template' ? 'Beneficiary Name' : 'Description/Variety'} value={item.desc} onChange={(e) => handleItemChange(index, 'desc', e.target.value)} /></div>
                        <div className="form-row">
                            {template === 'paddy_receipt' && <div className="form-group"><input placeholder="Lot ID" value={item.lot} onChange={(e) => handleItemChange(index, 'lot', e.target.value)} /></div>}
                            <div className="form-group"><input type="number" placeholder={template === 'rtgs_template' ? 'A/C No' : 'Qty/Bags'} value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} /></div>
                            <div className="form-group"><input type="number" placeholder={template === 'rtgs_template' ? 'Amount' : 'Rate'} value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} /></div>
                        </div>
                        {(template === 'paddy_receipt' || template === 'rtgs_template') && (
                            <div className="form-group"><input placeholder={template === 'paddy_receipt' ? "Gross Weight" : "IFSC Code"} value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} /></div>
                        )}
                        <button type="button" className="btn-danger" onClick={() => removeItem(index)} style={{width:'100%'}}>Remove</button>
                    </div>
                ))}
                <button type="button" className="btn-add" onClick={addItem}>+ Add Row</button>
            </div>
          )}

          {/* 6. Deductions (Paddy Only) */}
          {template === 'paddy_receipt' && (
            <>
                <div className="form-section-title">Deductions</div>
                <div className="form-row">
                    <div className="form-group"><label>Moisture</label><input type="number" name="deductionMoisture" value={formData.deductionMoisture} onChange={handleChange} /></div>
                    <div className="form-group"><label>Transport</label><input type="number" name="deductionTransport" value={formData.deductionTransport} onChange={handleChange} /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Packaging</label><input type="number" name="deductionPackaging" value={formData.deductionPackaging} onChange={handleChange} /></div>
                    <div className="form-group"><label>Other</label><input type="number" name="deductionOther" value={formData.deductionOther} onChange={handleChange} /></div>
                </div>
            </>
          )}

          {/* 7. General Amount & Notes */}
          {!['professional_invoice', 'paddy_receipt', 'rtgs_template'].includes(template) && (
             <div className="form-group"><label>Amount / Consideration</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} /></div>
          )}
          
          <div className="form-group"><label>Remarks / Body Content</label><textarea name="remarks" rows={3} value={formData.remarks} onChange={handleChange} /></div>

          {/* 8. Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn-print" onClick={handlePrint}>🖨 Print PDF</button>
            <button type="submit" className="btn-primary">Save Record</button>
          </div>
        </form>
      </div>

      {/* RIGHT PREVIEW PANE */}
      <div className="generator-preview-pane">
        <div className="a4-paper" ref={previewRef}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}