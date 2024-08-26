const forgetpassword = require("../models/forgetmodel");
const { OTP, transporter } = require("./otp");
const User = require('../models/registermodel');
const dotenv = require('dotenv').config()

module.exports.forgetpassword = async (req, res) => {
    try {
        const { email } = await req.body;
        const checkUser = await User.findOne({ email })
        if (!checkUser) {
            return res.status(404).json({
                msg: 'User Not Found Please Enter Registered Email'
            })
        }
        const existuser = await forgetpassword.findOne({ userID: checkUser._id })
        if (existuser) {
            return res.status(400).json({
                msg: 'you can request another reset link after 10 min'
            })
        }
        const resetotp = OTP();
        const resetData = new forgetpassword({
            userID: checkUser._id,
            email: checkUser.email,
            resetotp
        })
        await resetData.save()

       const mail = transporter().sendMail({
            from: process.env.E_Mail,
            to: checkUser.email,
            subject: "Reset Password",
            text: `https://feelfreetochat.netlify.app/#/reset_password?id=${checkUser._id}&token=${resetotp}`
        })

        return res.status(202).json({
            status: true,
            msg: 'Reset Link Has Sent To Your mail Please Check Mail'
        })

    } catch (err) {
        return res.status(500).json({
            msg: 'server error'
        })
    }
}

module.exports.resetpassword = async (req, res) => {
    try {
        const { password, confirmpass } = await req.body;
        // input not found error
        if (!password || !confirmpass) {
            return res.status(400).json({
                status: false,
                msg: 'Please fill all details'
            })
        }
        // password length error
        if (password.length < 6 || password.length > 20) {
            return res.status(402).json({
                msg: 'password must be 6 to 20 charecters'
            })
        }
        if (password != confirmpass) {
            return res.status(400).json({
                msg: 'password & confirm password must be same '
            })
        }
        const user = await User.findOne(req.user._id)
        if (!user) {
            return res.json({
                msg: 'user not found'
            })
        }
        user.password = password.trim()
        user.confirmpassword = confirmpass.trim()
        await user.save()
        await forgetpassword.findOneAndDelete({ userID: user._id })

        return res.status(201).json({
            status: true,
            msg: 'password changed continue log in'
        })
    } catch (err) {
        return res.status(500).json({
            msg: 'something went wrong please try again later'
        })
    }
}
