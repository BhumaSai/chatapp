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

// Add TTL index to automatically delete reset records after 10 minutes
forgetpassword.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("forgetpassword", forgetpassword);
