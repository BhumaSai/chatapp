const verificationUser = require("../models/verificationmodel");
const bcrypt = require('bcrypt')
const User = require('../models/registermodel')

const verification = async (req, res) => {
    try {
        const { email, otp } = await req.body;
        const userexist = await User.findOne({ email })
        if (!userexist) {
            return res.status(400).json({
                status: false,
                msg: 'invalid email enter registered email'
            })
        }
        if (userexist.verified) {
            return res.status(404).json({
                status: false,
                msg: 'user already verified please log in'
            })
        }

        const token = await verificationUser.findOne({ email })
        if (!token) {
            return res.status(401).json({
                status: false,
                msg: 'please enter valid email and otp'
            })
        }
        const users = await token.compareotp(otp)
        if (!users) {
            return res.status(401).json({
                status: false,
                msg: "otp not found please enter valid otp"
            })
        }
        if (users) {
            await verificationUser.findByIdAndDelete({ _id: token._id })
            const verifiedUser = await User.findById({ _id: token.userID })
            verifiedUser.verified = true
            await verifiedUser.save()
        }
        await User.findOneAndDelete({ verified: false })
        return res.status(202).json({
            status: false,
            msg: 'otp verified successfully'
        })


    } catch (err) {
        return res.status(500).json({
            status: false,
            msg: 'server error'
        })
    }
}

module.exports = verification