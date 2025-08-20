🚀 Job Portal Website

A full-stack Job Portal built using the MERN stack (MongoDB, Express, React, Node.js) with Vite for frontend bundling and Tailwind CSS for styling.
This platform allows job seekers to search and apply for jobs, while recruiters can post and manage job listings.

📌 Features
👨‍💻 For Job Seekers

User registration & login (JWT authentication)

Browse latest jobs

Search & filter jobs

View job details

Apply for jobs

🏢 For Recruiters

Post new job openings

Manage (edit/delete) job postings

Dashboard to track applicants

⚙️ General

Fully responsive UI with Tailwind CSS

RESTful API with Express.js

MongoDB database with Mongoose

Secure password hashing with bcrypt

Token-based authentication using JWT

🛠️ Tech Stack

Frontend

React + Vite

Tailwind CSS

React Router DOM

Axios

Backend

Node.js

Express.js

Mongoose

JWT + bcrypt

Database

MongoDB (MongoDB Atlas or local MongoDB)

Development Tools

Nodemon

Postman (for API testing)

📂 Project Structure
job-portal/
│── backend/           # Express + MongoDB API
│   ├── models/        # Mongoose models
│   ├── routes/        # Express routes
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Auth middleware
│   └── server.js      # App entry point
│
│── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Pages (Home, Login, Register, Jobs, Dashboard)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│
└── README.md

⚡ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/job-portal.git
cd job-portal

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm run dev

3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev


Frontend runs on 👉 http://localhost:5173
Backend runs on 👉 http://localhost:5000
