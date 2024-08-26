const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const forgetpassword = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    resetotp: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        expires: 600,

    }
})

forgetpassword.pre('save', async function (next) {
    if (this.isModified('resetotp')) {
        const resetcode = await bcrypt.hash(this.resetotp, 10);
        this.resetotp = resetcode
    }
    next()
})

forgetpassword.methods.comparetoken = async function (otpi) {
    const result = await bcrypt.compareSync(otpi, this.resetotp)
    return result
}


module.exports = mongoose.model('forgetpassword', forgetpassword)