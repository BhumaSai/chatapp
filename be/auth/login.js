const User = require("../models/registermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        msg: "Email and password are required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        status: false,
        msg: "Invalid credentials",
      });
    }
    if (!user.verified) {
      return res.status(403).json({
        status: false,
        msg: "Please verify your email before logging in.",
      });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(400).json({
        status: false,
        msg: "Invalid credentials",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.jwtPassword, {
      expiresIn: "30d",
    });
    // Remove password from user object before sending
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json({
      token: token,
      msg: "Successfully logged in",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Server error",
    });
  }
};

module.exports = login;
