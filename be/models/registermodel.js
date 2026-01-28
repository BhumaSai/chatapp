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
      type: Buffer,
      required: false,
      default: null,
    },
    imageType: {
      type: String,
      required: false,
      default: null,
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
    toJSON: {
      transform: function (doc, ret) {
        if (ret.image && ret.imageType) {
          // Check if it's already a string or a Buffer
          const buffer = Buffer.isBuffer(ret.image) ? ret.image : (ret.image.buffer || ret.image);
          if (Buffer.isBuffer(buffer)) {
            ret.image = `data:${ret.imageType};base64,${buffer.toString('base64')}`;
          }
        }
        delete ret.password;
        return ret;
      }
    },
    toObject: {
      transform: function (doc, ret) {
        if (ret.image && ret.imageType) {
          const buffer = Buffer.isBuffer(ret.image) ? ret.image : (ret.image.buffer || ret.image);
          if (Buffer.isBuffer(buffer)) {
            ret.image = `data:${ret.imageType};base64,${buffer.toString('base64')}`;
          }
        }
        delete ret.password;
        return ret;
      }
    }
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

// Add TTL index to automatically delete unverified users after 10 minutes
User.index({ createdAt: 1 }, { expireAfterSeconds: 600, partialFilterExpression: { verified: false } });

module.exports = mongoose.model("user", User);
