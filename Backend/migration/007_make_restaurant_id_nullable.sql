-- Make restaurantId nullable in orders table
ALTER TABLE orders MODIFY COLUMN restaurantId UUID REFERENCES restaurants(id) NULL; 