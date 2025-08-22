# ChatApp

A modern, secure one-on-one chat application built with React (frontend) and Node.js/Express/MongoDB (backend).

## Features
- One-on-one real-time chat
- User authentication and registration
- Encrypted message storage (AES-256)
- Responsive, mobile-friendly UI
- User profile and friend management
- Notifications and friend requests
- Secure password reset and email verification

---

## Frontend (`userI`)
- **Framework:** React
- **Styling:** CSS (responsive, modern design)
- **Routing:** React Router
- **State Management:** React hooks
- **Socket:** Socket.io-client for real-time messaging
- **API Calls:** Axios
- **Components:**
  - Chat (one-on-one messaging)
  - User list and profile
  - Notifications
  - Loader and Footer
  - Responsive navigation bar

### How to Run Frontend
1. Navigate to `userI` folder
2. Install dependencies: `npm install`
3. Start the app: `npm run start`

---

## Backend (`be`)
- **Framework:** Node.js + Express
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **Email:** Nodemailer for verification and password reset
- **Encryption:** AES-256 for message content
- **APIs:**
  - User registration, login, profile
  - Friend management (add, accept, delete)
  - Messaging (save, fetch, encrypt/decrypt)
  - Password reset and OTP verification

### How to Run Backend
1. Navigate to `be` folder
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` (see below)
4. Start the server: `node index.js` or `npm run server`

---

## Environment Variables
Create a `.env` file in the `be` folder with:
```
MONGODB_URI=uri
E_Mail=your_email@gmail.com
Password=your_email_password
jwtPassword=your_jwt_secret
MESSAGE_ENCRYPTION_KEY=your_32_byte_secret_key
```

---

## Folder Structure
```
chatapp/
  be/         # Backend (Node.js/Express)
  userI/      # Frontend (React)
```

---

## Security Notes
- All messages are encrypted before saving to the database.
- Passwords are hashed using bcrypt.
- Email verification and password reset are implemented.


