const mongoose = require('mongoose')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } })
require('dotenv').config()
const register = require('./auth/register')
const login = require('./auth/login')
const { forgetpassword, resetpassword } = require('./auth/forgetpassword')
const cors = require('cors')
const verification = require('./auth/verification')
const verifylink = require('./middleware/resetpass')
const { middleware } = require('./middleware/protect')
const { savemessages, getmessages } = require('./chat.js/messages');
const { getUserFriends, addFriends, allUsers, userProfile, acceptRequest, deleteRequest, friend_request } = require('./chat.js/userfriends');
// cors 
app.use(cors());

// json
app.use(express.json())
// db connection
mongoose.connect(process.env.URI)
// db connection


// authentification routes
app.post('/register', register)
app.post('/login', login)
app.post('/otp-verification', verification)
app.post('/forget_password_verification', forgetpassword)
app.post('/reset_password', verifylink, resetpassword)
app.post('/add-messages', savemessages)
app.get('/get-messages/:senderID/:receiverID', getmessages)
app.get('/my-profile', middleware, userProfile)
app.get('/all-users', middleware, allUsers)
// authentfication routes

// user data
app.post('/getuser', addFriends)

app.get('/friend-requests', middleware, friend_request)
app.put('/accept-request', acceptRequest)
app.delete('/delete-request/:requestedUser/:acceptedUser', deleteRequest)
app.get('/user-friends', middleware, getUserFriends)
// user data 



// socket connection

var currentUser = []

const addUser = (id, socket) => {
    !currentUser.some(data => data.User === id) &&
        currentUser.push({ User: id, socketID: socket })

}
const deleteUser = (socket) => {
    currentUser = currentUser.filter(data => data.socketID !== socket)
}

const getReceiver = (Rid) => {
    return currentUser.find(user => user.User === Rid)
}

io.on('connection', (socket) => {
    socket.on('add-user', (User) => {
        addUser(User, socket.id)
    })
    socket.on('FromSender', ({ senderID, receiverID, message, updatedAt }) => {
        const user = getReceiver(receiverID)
        if (user) {
            socket.to(user.socketID).emit('conversation', {
                senderID, receiverID, message, updatedAt
            })
        }
    })
    socket.emit('onlineUsers', currentUser)
    // socket disconnect
    socket.on('disconnect', () => {
        deleteUser(socket.id)
    })

})


const Port = process.env.URL || 4000

server.listen(Port)

