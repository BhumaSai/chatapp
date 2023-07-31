const mongoose = require('mongoose')

const userfriend = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    friendID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userfriends: {
        type: Object,
        required: true
    },
    request: {
        type: Boolean,
        default: false,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("userfriend", userfriend)