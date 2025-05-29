# 💬 Chat App

A real-time chat application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. This app enables private messaging, friend requests, online status indicators, and a responsive user experience.

🔗 **Live Demo**: [feelfreetochat.netlify.app](https://feelfreetochat.netlify.app)

This project showcases both my **full-stack web development skills** and my **awareness of web application vulnerabilities**.  
I applied **web penetration testing techniques** to this project and identified the following issues:

- 🕵️ **Information Disclosure**: Certain API responses exposed sensitive information, such as internal errors and user data.
- 🔒 **Lack of Message Encryption**: Messages are transmitted and stored without encryption, which could expose sensitive communication.
- ✅ **Security Awareness**: I applied best practices such as input validation, error handling, and token-based authentication to strengthen security, while leaving encryption as a known limitation for demonstration purposes.

---
## Project Structure

chatapp/
├── client/             # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
├── server/             # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── package.json
└── README.md

---

## 🚀 Features
- Secure user authentication and authorization
- Friend requests and private chat
- Real-time messaging using Socket.IO
- Online/offline status indicators
- Fully responsive design for web and mobile devices

---

## 🛠 Tech Stack
- **Frontend**: React.js, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO

---

## ⚙️ Getting Started
1. **Clone the repo**:  
   `git clone https://github.com/BhumaSai/chatapp.git && cd chatapp`

2. **Install dependencies**:  
   Backend: `cd server && npm install`  
   Frontend: `cd ../client && npm install`

3. **Configure environment** (`server/.env`):
`PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret`

4. **Run the app**:  
Backend: `cd server && npm start`  
Frontend: `cd client && npm run server`

---

## 📄 License
Licensed under the MIT License.

## 📬 Contact
For inquiries, contact [bhumasairam123@gmail.com].

---

