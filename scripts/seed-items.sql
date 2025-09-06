-- This script will be converted to a Node.js script to seed the MongoDB database
-- Sample items for the e-commerce store

-- Electronics
INSERT INTO items (name, description, price, category, image, stock) VALUES
('iPhone 15 Pro', 'Latest Apple smartphone with advanced camera system', 999.99, 'Electronics', '/placeholder.svg?height=300&width=300', 50),
('MacBook Air M3', 'Powerful laptop with M3 chip and all-day battery life', 1299.99, 'Electronics', '/placeholder.svg?height=300&width=300', 25),
('AirPods Pro', 'Wireless earbuds with active noise cancellation', 249.99, 'Electronics', '/placeholder.svg?height=300&width=300', 100);

-- Clothing
INSERT INTO items (name, description, price, category, image, stock) VALUES
('Premium Cotton T-Shirt', 'Comfortable and stylish cotton t-shirt', 29.99, 'Clothing', '/placeholder.svg?height=300&width=300', 200),
('Denim Jeans', 'Classic blue denim jeans with perfect fit', 79.99, 'Clothing', '/placeholder.svg?height=300&width=300', 150),
('Winter Jacket', 'Warm and waterproof winter jacket', 149.99, 'Clothing', '/placeholder.svg?height=300&width=300', 75);

-- Books
INSERT INTO items (name, description, price, category, image, stock) VALUES
('The Art of Programming', 'Comprehensive guide to software development', 49.99, 'Books', '/placeholder.svg?height=300&width=300', 80),
('Modern Web Design', 'Learn the latest web design techniques', 39.99, 'Books', '/placeholder.svg?height=300&width=300', 60);

-- Home
INSERT INTO items (name, description, price, category, image, stock) VALUES
('Smart Home Speaker', 'Voice-controlled smart speaker with AI assistant', 99.99, 'Home', '/placeholder.svg?height=300&width=300', 120),
('Coffee Maker', 'Automatic coffee maker with programmable settings', 129.99, 'Home', '/placeholder.svg?height=300&width=300', 40);
