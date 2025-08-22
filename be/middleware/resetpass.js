const forgetpassword = require("../models/forgetmodel");
const User = require("../models/registermodel");

const verifylink = async (req, res, next) => {
  try {
    const { id, token } = req.query;
    const user = await forgetpassword.findOne({ userID: id });
    if (!user) {
      return res.status(400).json({
        msg: "data not found",
      });
    }
    const tokenc = await user.comparetoken(token);
    if (!tokenc) {
      return res.status(400).json({
        msg: "token not found",
      });
    }
    req.user = id;
    next();
  } catch (err) {
    return res.status(500).json({
      status: false,
      msg: "invalid request",
    });
  }
};
module.exports = verifylink;
