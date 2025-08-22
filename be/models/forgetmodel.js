const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const forgetpassword = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    resetotp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

forgetpassword.pre("save", async function (next) {
  if (this.isModified("resetotp")) {
    try {
      const resetcode = await bcrypt.hash(this.resetotp, 10);
      this.resetotp = resetcode;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

forgetpassword.methods.comparetoken = async function (otpi) {
  return await bcrypt.compare(otpi, this.resetotp);
};

module.exports = mongoose.model("forgetpassword", forgetpassword);
