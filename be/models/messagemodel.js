const mongoose = require("mongoose");
const { Schema } = mongoose;

// Conversation schema: stores all messages between two users in a single document
const messagesModel = new Schema(
  {
    userIDs: {
      type: [mongoose.Schema.Types.ObjectId], // [user1, user2]
      required: true,
      validate: [(arr) => arr.length === 2, "Must have exactly two user IDs"],
    },
    messages: [
      {
        senderID: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        message: {
          type: String,
          required: true,
          maxlength: 1048576, // 1MB max size
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", messagesModel);
