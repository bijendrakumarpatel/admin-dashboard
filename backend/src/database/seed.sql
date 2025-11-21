USE admin_dashboard;

-- Default Admin Account
INSERT INTO users (name, email, phone, password_hash, role)
VALUES 
('Super Admin', 'admin@example.com', '9999999999', 
'$2a$10$0KFb3vo7aR7Hy0qdBNGULuGfV5Wl7zBLmks5nZUD/7yAwHPmEnQF2', 
'admin');

-- customers seed
INSERT INTO customers (name, phone, email, address, gst_number)
VALUES
('Rahul Traders', '9876543210', 'rahul@gmail.com', 'Delhi', 'GST12345'),
('Sharma Enterprises', '8800332211', 'sharma@gmail.com', 'Lucknow', 'GST56789');

-- products seed
INSERT INTO products (name, category, price, stock, unit)
VALUES
('Rice (Basmati)', 'Food', 65.00, 1000, 'kg'),
('Wheat', 'Food', 40.00, 500, 'kg'),
('Sugar', 'Food', 45.00, 800, 'kg');

-- sample agreement
INSERT INTO agreements (customer_id, product_id, agreement_date, amount, terms)
VALUES
(1, 1, CURDATE(), 150000, 'Monthly supply agreement');

-- sample order
INSERT INTO orders (customer_id, order_date, total_amount, status)
VALUES
(1, CURDATE(), 3500, 'completed');

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
(1, 1, 50, 70);

-- sample payment
INSERT INTO payments (customer_id, order_id, amount, payment_method, payment_date)
VALUES
(1, 1, 3500, 'upi', CURDATE());

-- sample expenses
INSERT INTO expenses (category, amount, expense_date, description)
VALUES
('Transport', 500, CURDATE(), 'Truck fuel'),
('Electricity', 1200, CURDATE(), 'Factory bill');

