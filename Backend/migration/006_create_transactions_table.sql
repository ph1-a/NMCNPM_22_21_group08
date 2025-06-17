CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orderId UUID REFERENCES orders(id),
  paymentMethod VARCHAR(50),
  amount FLOAT,
  status VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 