Backend (1st cmd screen)
Navigate to backend folder
npm install
npm install sequelize sqlite3
npm run init-db
npm install bcrypt jsonwebtoken
node server.js

Frontend
Navigate to frontend folder
npm install
npm start

Install
Ensure there're a connected device (Emulated or not)
npm run android

For backend testing
REM 1. Create a new user
curl -X POST http://localhost:3000/api/users/signup -H "Content-Type: application/json" -d "{\"email\":\"newuser@example.com\",\"password\":\"password123\",\"name\":\"New User\"}"

REM 2. Login and get token
curl -X POST http://localhost:3000/api/users/signin -H "Content-Type: application/json" -d "{\"email\":\"newuser@example.com\",\"password\":\"password123\"}"

REM 3. Search for food
curl -X GET "http://localhost:3000/api/search?query=pizza"

REM 4. Place an order (replace YOUR_AUTH_TOKEN with actual token)
curl -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_AUTH_TOKEN" -d "{\"items\":[{\"foodId\":\"694bdb26-0a1c-4ca7-93e3-5766a3802570\",\"quantity\":1}],\"address\":\"456 Main Street\"}"
Example : curl -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkOTI5YWU0LTUxZGYtNGIxOS1iYzRmLTdkMmM5NTJkMjFiOCIsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc1MDI4NjU0OSwiZXhwIjoxNzUwMjkwMTQ5fQ.hlFC7DxLtTN-ZKdP_VlPIWJvr9vR4X4ViEj6AB3KrjQ" -d "{\"items\":[{\"foodId\":\"694bdb26-0a1c-4ca7-93e3-5766a3802570\",\"quantity\":1}],\"address\":\"456 Main Street\"}"
REM 5. View order history
curl -X GET http://localhost:3000/api/orders -H "Authorization: Bearer YOUR_AUTH_TOKEN"
# Search for pizza
curl -X GET "http://localhost:3000/api/search?query=pizza"

# Search for sushi
curl -X GET "http://localhost:3000/api/search?query=sushi"

# Search for restaurants
curl -X GET "http://localhost:3000/api/search?query=restaurant"

