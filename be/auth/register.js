const User = require('../models/registermodel');
const verificationmodel = require('../models/verificationmodel');
const { OTP, transporter, emailtemplate } = require('./otp');
const dotenv = require('dotenv').config()

const register = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, image, gender } = await req.body;

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(404).json({
                status: false,
                msg: '*user already exist'
            })
        }
        if (password.length <= 6) {
            return res.status(404).json({
                status: false,
                msg: '*password must be more than 6 charecters'
            })
        }
        if (password != confirmpassword) {
            return res.status(404).json({
                status: false,
                msg: '*password & confirmpassword must be same'
            })
        }
        // user schema
        const newUser = new User({
            name, email, password, confirmpassword, image, gender
        })

        const otpNo = OTP()
        // user verification
        const verification = new verificationmodel({
            userID: newUser.id,
            otp: otpNo,
            email: newUser.email
        })
        await verification.save()
        await newUser.save()

        transporter().sendMail({
            from: process.env.E_Mail,
            to: newUser.email,
            subject: 'OTP verification',
            html: `<h2>otp</h2></br>${otpNo}</p>`
        })
        return res.status(200).json({
            status: true,
            msg: "successflly registered"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: 'server error'
        })
    }
}
module.exports = register