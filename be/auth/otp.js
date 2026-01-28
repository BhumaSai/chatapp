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
  port: 587,
  secure: false, // Use STARTTLS (true for 465, false for 587)
  pool: true,
  auth: {
    user: process.env.E_Mail,
    pass: process.env.Password
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  connectionTimeout: 15000, // 15 seconds
  greetingTimeout: 10000,   // 10 seconds
  socketTimeout: 20000      // 20 seconds
})


// module.exports = OTP
// module.exports = transporter