const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const verificationUser = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

verificationUser.pre("save", async function (next) {
  if (this.isModified("otp")) {
    const otpverify = await bcrypt.hash(this.otp, 10);
    this.otp = otpverify;
  }
  next();
});

verificationUser.methods.compareotp = async function (otpi) {
  const result = await bcrypt.compareSync(otpi, this.otp);
  return result;
};

module.exports = mongoose.model("verificationUser", verificationUser);
