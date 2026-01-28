const User = require("../models/registermodel");
const verificationmodel = require("../models/verificationmodel");
const { OTP, transporter, emailtemplate } = require("./otp");
const dotenv = require("dotenv").config();

const register = async (req, res) => {
  try {
    const { name, email, password, confirmpassword, image, gender } = req.body;
    // Check required fields
    if (!name || !email || !password || !confirmpassword || !gender) {
      return res.status(400).json({
        status: false,
        msg: "All required fields must be filled",
      });
    }
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    // Check if user exists
    const exist = await User.findOne({ email: normalizedEmail });
    if (exist) {
      if (exist.verified) {
        return res.status(409).json({
          status: false,
          msg: "User already exists",
        });
      } else {
        await User.deleteOne({ _id: exist._id });
      }
    }
    // Password strength validation
    const PASSWORD_REGEX =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{6,20}$/;
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        status: false,
        msg: "Password must be 6-20 characters, include uppercase, lowercase, number, and special character.",
      });
    }
    if (password !== confirmpassword) {
      return res.status(400).json({
        status: false,
        msg: "Password & confirmpassword must be same",
      });
    }
    // Process image if provided
    let imageData = null;
    let imageType = null;
    if (image && image.includes('base64')) {
      const parts = image.split(';base64,');
      imageType = parts[0].split(':')[1];
      imageData = Buffer.from(parts[1], 'base64');
    }

    // user schema
    const newUser = new User({
      name,
      email: normalizedEmail,
      password,
      image: imageData,
      imageType: imageType,
      gender,
    });
    // Prevent duplicate verification records
    await verificationmodel.deleteMany({ email: normalizedEmail });
    const otpNo = OTP();
    // user verification
    const verification = new verificationmodel({
      userID: newUser.id,
      otp: otpNo,
      email: normalizedEmail,
    });
    await verification.save();
    await newUser.save();

    // Send OTP email asynchronously to speed up response
    transporter().sendMail({
      from: process.env.E_Mail,
      to: normalizedEmail,
      subject: "OTP verification",
      html: `<h2>OTP</h2></br>${otpNo}</p>`,
    }).catch(err => {
      console.error("Delayed Email Error:", err.message);
    });

    return res.status(200).json({
      status: true,
      msg: "Successfully registered. Please check your email for OTP.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      msg: "server error",
    });
  }
};
module.exports = register;
