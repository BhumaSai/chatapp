const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    // confirmpassword removed: should not be stored in DB
    image: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/bhuma00sai/image/upload/v1690276911/fnuexdv9nsdsbw1tyfpo.png",
    },
    friends: {
      type: Array,
    },
    gender: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

User.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const securepass = await bcrypt.hash(this.password, 10);
      this.password = securepass;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

User.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("user", User);
