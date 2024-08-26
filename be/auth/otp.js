const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()

module.exports.OTP = () => {
  let otp = '';
  for (let i = 0; i <= 5; i++) {
    let onetimepassword = Math.floor(Math.random() * 9)
    otp += onetimepassword
  }
  return otp;
}
module.exports.transporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.E_Mail,
    pass: process.env.Password
  }
})


// module.exports = OTP
// module.exports = transporter