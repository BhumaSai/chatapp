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
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  pool: true,   // Use pooled connections
  auth: {
    user: process.env.E_Mail,
    pass: process.env.Password
  },
  tls: {
    rejectUnauthorized: false // Helps with some hosting provider restrictions
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,    // 5 seconds
  socketTimeout: 15000      // 15 seconds
})


// module.exports = OTP
// module.exports = transporter