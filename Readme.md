BlogApp - MERN Stack Blogging Platform
A full-stack blogging application with user authentication, admin approval system, and rich text editing.
Quick Start
Prerequisites
•	Node.js (v16+)
•	MongoDB
•	npm/yarn

1. Project Setup
Backend(.env)
MONGODB_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
PORT=5000

# Optional
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

2. Backend Setup
npm install
npm run seed
npm run dev

3. Frontend Setup
npm install
npm run dev
4. Access Application
Frontend: http://localhost:3000
Backend: http://localhost:5000


5. Default Admin Login
•	Email: root@admin.com
•	Password: admin123

Tech Stack
•	Frontend: React, Vite, Tailwind CSS
•	Backend: Node.js, Express, MongoDB
•	Auth: JWT, bcryptjs
Start both servers and visit http://localhost:3000 to begin!
