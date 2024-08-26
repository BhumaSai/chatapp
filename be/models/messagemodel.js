const mongoose = require('mongoose')
const { Schema } = mongoose;

const messagesModel = new Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model("messagesModel", messagesModel)