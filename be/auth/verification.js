const verificationUser = require("../models/verificationmodel");
const bcrypt = require("bcrypt");
const User = require("../models/registermodel");

const verification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        status: false,
        msg: "Email and OTP are required.",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const userexist = await User.findOne({ email: normalizedEmail });
    if (!userexist) {
      return res.status(400).json({
        status: false,
        msg: "Invalid email. Enter registered email.",
      });
    }
    if (userexist.verified) {
      return res.status(409).json({
        status: false,
        msg: "User already verified. Please log in.",
      });
    }
    // Check OTP expiration and resend if needed
    const tokenRecord = await verificationUser.findOne({
      email: normalizedEmail,
      userID: userexist._id,
    });
    if (!tokenRecord) {
      return res.status(401).json({
        status: false,
        msg: "No OTP found for this user. Please request a new OTP.",
      });
    }
    const now = Date.now();
    const createdAt = tokenRecord.createdAt
      ? new Date(tokenRecord.createdAt).getTime()
      : 0;
    const expireTime = 10 * 60 * 1000; // 10 minutes
    if (now - createdAt > expireTime) {
      // Remove expired OTP and send new one
      await verificationUser.deleteOne({ _id: tokenRecord._id });
      // Generate and save new OTP
      const { OTP, transporter } = require("./otp");
      const newOtp = OTP();
      const newVerification = new verificationUser({
        userID: userexist._id,
        otp: newOtp,
        email: normalizedEmail,
      });
      await newVerification.save();
      try {
        await transporter().sendMail({
          from: process.env.E_Mail,
          to: normalizedEmail,
          subject: "OTP verification",
          html: `<h2>OTP</h2></br>${newOtp}</p>`,
        });
      } catch (mailErr) {
        return res.status(500).json({
          status: false,
          msg: "OTP expired. Failed to send new OTP email.",
        });
      }
      return res.status(440).json({
        status: false,
        msg: "OTP expired. A new OTP has been sent to your email.",
      });
    }
    // Validate OTP
    const isOtpValid = await tokenRecord.compareotp(otp);
    if (!isOtpValid) {
      return res.status(401).json({
        status: false,
        msg: "OTP not found or expired. Please enter valid OTP.",
      });
    }
    await verificationUser.findByIdAndDelete(tokenRecord._id);
    const verifiedUser = await User.findById(tokenRecord.userID);
    if (verifiedUser) {
      verifiedUser.verified = true;
      await verifiedUser.save();
    }
    return res.status(200).json({
      status: true,
      msg: "OTP verified successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      msg: "Server error",
    });
  }
};

module.exports = verification;
