-- ============================================================
--   DATABASE SETUP
-- ============================================================

CREATE DATABASE IF NOT EXISTS company_admin;
USE company_admin;

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
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    gst_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'kg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    order_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending','completed','cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ORDER ITEMS
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_id INT,
    amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash','bank','upi') DEFAULT 'cash',
    payment_date DATE NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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
