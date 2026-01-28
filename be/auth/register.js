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

    try {
      // Save user and verification data
      await newUser.save();
      await verification.save();

      // Send OTP email - Await to ensure delivery success for accurate response
      await transporter().sendMail({
        from: process.env.E_Mail,
        to: normalizedEmail,
        subject: "OTP Verification - ChatApp",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #008b8b;">Verification Code</h2>
            <p>Thank you for registering! Your OTP for verification is:</p>
            <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px; color: #008b8b;">${otpNo}</h1>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `,
      });

      return res.status(200).json({
        status: true,
        msg: "Successfully registered. Please check your email for OTP.",
      });

    } catch (mailError) {
      console.error("Registration Process Error:", mailError);

      // Cleanup: If mail fails, we should ideally not leave the unverified user in a half-created state
      // though the TTL index will catch it, it's better to report the error immediately.
      await User.deleteOne({ _id: newUser._id });
      await verificationmodel.deleteOne({ _id: verification._id });

      return res.status(500).json({
        status: false,
        msg: "Failed to send OTP email. Please try again later.",
        error: mailError.message
      });
    }

  } catch (error) {
    console.error("General Registration Error:", error);
    return res.status(500).json({
      status: false,
      msg: "Server error during registration",
    });
  }
};
module.exports = register;
