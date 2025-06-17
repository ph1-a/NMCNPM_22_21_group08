CREATE TABLE menuitems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  price FLOAT NOT NULL,
  rating FLOAT DEFAULT 0,
  reviewCount INTEGER DEFAULT 0,
  distance FLOAT DEFAULT 0,
  image VARCHAR(255),
  description TEXT,
  restaurantId UUID REFERENCES restaurants(id)
); 