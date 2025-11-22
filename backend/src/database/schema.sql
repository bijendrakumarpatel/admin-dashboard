-- ============================================================
--   DATABASE SETUP
-- ============================================================

CREATE DATABASE IF NOT EXISTS admin-dashboard;
USE admin-dashboard;

-- ============================================================
-- USERS TABLE
-- ============================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- OTP TABLE  (backend expects "otps")
-- ============================================================

CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(100) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) DEFAULT 'login',
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX otps_identifier_index ON otps(identifier);

-- ============================================================
-- CUSTOMERS
-- ============================================================

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Basic Identity
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,         -- Required field
    email VARCHAR(100),
    gst_number VARCHAR(20),             -- Stores the GSTIN
    
    -- Address Details (New Fields)
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    
    -- Financials & Classification (New Fields)
    customer_type VARCHAR(50) DEFAULT 'Regular', -- Stores 'Regular', 'VIP', 'Wholesaler'
    opening_balance DECIMAL(15, 2) DEFAULT 0.00, -- Stores initial balance
    credit_limit DECIMAL(15, 2) DEFAULT 0.00,    -- Stores max credit allowed
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- ============================================================
-- PRODUCTS
-- ============================================================

-- ============================================================
-- PRODUCTS TABLE (Complete Definition with Premium Fields)
-- ============================================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Identity & Core Details
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE,              -- Unique Product Code (SKU)
    category VARCHAR(100),
    unit VARCHAR(50) DEFAULT 'Kg',
    description TEXT,
    
    -- Pricing
    sale_price DECIMAL(10, 2) NOT NULL,  -- Standard Selling Price (matches 'price' from old schema)
    cost_price DECIMAL(10, 2) DEFAULT 0.00,  -- Internal Cost Price
    
    -- Inventory
    stock_quantity INT DEFAULT 0,        -- Stores current stock ('stock' from old schema)
    min_stock_alert INT DEFAULT 10,      -- Minimum quantity before alert ('minStock' in React)
    
    -- Media
    image_url VARCHAR(500),              -- Stores URL or Base64 data for product image
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- ============================================================
-- AGREEMENTS
-- ============================================================
-- ============================================================
-- AGREEMENTS & DOCUMENTS (Updated for Document Generator)
-- ============================================================

-- Drop table if it exists to ensure clean creation (Optional: Remove if preserving data)
-- DROP TABLE IF EXISTS agreements;

CREATE TABLE agreements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Core Links
    customer_id INT NOT NULL,
    product_id INT DEFAULT NULL, -- Made NULLable as some docs (like Letters) don't link to specific inventory products
    
    -- Document Classification
    template_type VARCHAR(50) NOT NULL DEFAULT 'lease', -- Stores: 'professional_invoice', 'paddy_receipt', 'lease', etc.
    
    -- Dates
    start_date DATE NOT NULL,        -- Maps to React: startDate
    end_date DATE DEFAULT NULL,      -- Maps to React: endDate
    
    -- Financials
    amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Increased precision for large rice mill transactions
    
    -- The "Magic" Column: Stores all dynamic form data (Items, Party Details, Deductions)
    -- Uses JSON type for MySQL 5.7+ (Recommended) or use TEXT/LONGTEXT for older versions
    document_data JSON, 
    
    -- Status Tracking
    status ENUM('active', 'completed', 'cancelled', 'draft') DEFAULT 'active',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraints
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================================
-- INDEXES (For faster searching)
-- ============================================================
CREATE INDEX idx_agreements_customer ON agreements(customer_id);
CREATE INDEX idx_agreements_date ON agreements(start_date);
CREATE INDEX idx_agreements_template ON agreements(template_type);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    
    -- Financials
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Order Status (Expanded)
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned') DEFAULT 'pending',
    
    -- Payment Tracking (New Premium Fields)
    payment_status ENUM('unpaid', 'paid', 'partial', 'refunded') DEFAULT 'unpaid',
    payment_method ENUM('Cash', 'Online', 'UPI', 'Cheque', 'Bank Transfer', 'Credit') DEFAULT NULL,
    transaction_ref VARCHAR(100) DEFAULT NULL, -- To store UPI ID or Cheque No.
    
    -- Shipping Info
    shipping_address TEXT DEFAULT NULL,
    
    -- Meta Data
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================================
-- ORDER ITEMS (Updated)
-- ============================================================

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    
    -- Quantity & Pricing
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL, -- Price of 1 unit at time of order
    total_price DECIMAL(12,2) NOT NULL, -- (quantity * unit_price) - useful for reports
    
    -- Product Details Snapshot (Optional but recommended)
    product_name_snapshot VARCHAR(255) DEFAULT NULL, -- Stores name in case product is deleted later

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
-- ============================================================
-- PAYMENTS (Updated for Premium Form Features)
-- ============================================================

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_id INT DEFAULT NULL, -- Optional: To link a payment to a specific Order ID
    
    -- Transaction Type (Matches the "Received vs Paid" toggle)
    payment_type ENUM('received', 'paid') NOT NULL DEFAULT 'received', 
    
    -- Core Details
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    
    -- Method & Banking Info (Matches React Form Dropdown)
    payment_method ENUM('Cash', 'Online', 'UPI', 'Cheque', 'Bank Transfer') DEFAULT 'Cash',
    
    -- Dynamic Fields (For Online/Cheque payments)
    bank_name VARCHAR(100) DEFAULT NULL,       -- Stores Bank Name or App Name (e.g., "HDFC", "GPay")
    transaction_ref VARCHAR(100) DEFAULT NULL, -- Stores Cheque No or UPI Transaction ID
    
    -- Proof / Attachments
    proof_image LONGTEXT DEFAULT NULL, -- Stores the Base64 image string or URL for the receipt/person
    
    -- Status (Optional: To track if a cheque cleared or online payment failed)
    status ENUM('pending', 'completed', 'failed', 'bounced') DEFAULT 'completed',
    
    -- Meta Data
    remarks TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
-- ============================================================
-- EXPENSES
-- ============================================================

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- REFRESH TOKENS
-- ============================================================

CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
