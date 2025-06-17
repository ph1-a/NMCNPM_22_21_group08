CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id),
  menuItemId UUID REFERENCES menuitems(id),
  username VARCHAR(255) NOT NULL,
  userInitial VARCHAR(5) NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL
); 