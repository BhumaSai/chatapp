const forgetpassword = require("../models/forgetmodel");
const { OTP, transporter } = require("./otp");
const User = require("../models/registermodel");
const { request } = require("express");
const dotenv = require("dotenv").config();
const rateLimit = {};
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{6,20}$/;

module.exports.forgetpassword = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
    email = email.trim().toLowerCase();
    // Rate limiting: allow one request per 5 minutes per email
    if (rateLimit[email] && Date.now() - rateLimit[email] < 1 * 60 * 1000) {
      return res
        .status(429)
        .json({ msg: "Please wait before requesting another reset." });
    }
    rateLimit[email] = Date.now();
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({
        msg: "User Not Found Please Enter Registered Email",
      });
    }
    const existuser = await forgetpassword.findOne({ userID: checkUser._id });
    if (existuser) {
      // Check if token is expired (assuming createdAt is present)
      const expireTime = 15 * 60 * 1000; // 15 minutes
      if (
        existuser.createdAt &&
        Date.now() - new Date(existuser.createdAt).getTime() < expireTime
      ) {
        return res.status(409).json({
          msg: "Reset Link has already been sent. Please check your email or wait for it to expire.",
        });
      } else {
        await forgetpassword.deleteOne({ userID: checkUser._id });
      }
    }
    const resetotp = OTP();
    const resetData = new forgetpassword({
      userID: checkUser._id,
      email: checkUser.email,
      resetotp,
    });
    await resetData.save();
    // console.log(
    //   `http://localhost:3000/#/reset_password?id=${checkUser._id}&token=${resetotp}`
    // );
    const mailTransporter = transporter();
    try {
      await mailTransporter.sendMail({
        from: process.env.E_Mail,
        to: checkUser.email,
        subject: "Secure Password Reset - ChatApp",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #008b8b;">Password Reset Request</h2>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <a href="https://feelfreetochat.netlify.app/#/reset_password?id=${checkUser._id}&token=${resetotp}" 
               style="background: #008b8b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
               Reset My Password
            </a>
            <p style="margin-top: 20px; font-size: 0.9rem; color: #666;">
              Or copy and paste this link in your browser:<br>
              https://feelfreetochat.netlify.app/#/reset_password?id=${checkUser._id}&token=${resetotp}
            </p>
            <p>This link will expire in 15 minutes.</p>
          </div>
        `,
      });

      return res.status(200).json({
        status: true,
        msg: "Reset Link Has Sent To Your mail Please Check Mail",
      });

    } catch (mailError) {
      console.log("Forget Password Mail Error:", mailError);
      return res.status(500).json({
        status: false,
        msg: "Failed to send reset link. Please try again later.",
        error: mailError.message
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: "server error",
    });
  }
};

module.exports.resetpassword = async (req, res) => {
  try {
    const { password, confirmpass } = req.body;

    // input not found error
    if (!password || !confirmpass) {
      return res.status(400).json({
        status: false,
        msg: "Please fill all details including token and user id",
      });
    }
    // password strength error
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(402).json({
        msg: "Password must be 6-20 characters, include uppercase, lowercase, number, and special character.",
      });
    }
    if (password !== confirmpass) {
      return res.status(400).json({
        msg: "Password & confirm password must be same ",
      });
    }
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        msg: "user not found",
      });
    }
    // Validate token
    const resetRecord = await forgetpassword.findOne({ userID: user._id });
    if (!resetRecord) {
      return res
        .status(400)
        .json({ msg: "No reset request found or token expired." });
    }
    try {
      await forgetpassword.findOneAndDelete({ userID: user._id });
    } catch (err) {
      return res.status(500).json({ msg: "Error deleting reset record." });
    }

    return res.status(201).json({
      status: true,
      msg: "password changed continue log in",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "something went wrong please try again later",
    });
  }
};
