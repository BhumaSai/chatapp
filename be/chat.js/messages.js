const Conversation = require("../models/messagemodel");
const crypto = require("crypto");

let rawKey =
  process.env.MESSAGE_ENCRYPTION_KEY || "default_secret_key_32bytes!";
if (rawKey.length < 32) {
  rawKey = rawKey.padEnd(32, "0");
} else if (rawKey.length > 32) {
  rawKey = rawKey.slice(0, 32);
}
const ENCRYPTION_KEY = rawKey;
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports.savemessages = async (req, res) => {
  try {
    const { message, senderID, receiverID } = req.body;
    if (!message || !senderID || !receiverID) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    const encryptedMessage = encrypt(message);
    // Always sort userIDs to ensure consistent document
    const userIDs = [senderID, receiverID].sort();
    let conversation = await Conversation.findOne({ userIDs });
    if (!conversation) {
      conversation = new Conversation({ userIDs, messages: [] });
    }
    conversation.messages.push({ senderID, message: encryptedMessage });
    await conversation.save();
    return res.status(201).json({ msg: "Message saved successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Error saving message", error });
  }
};

module.exports.getmessages = async (req, res) => {
  try {
    const { senderID, receiverID } = req.params;
    if (!senderID || !receiverID) {
      return res.status(400).json({ msg: "Missing required params" });
    }
    // Always sort userIDs to ensure consistent document
    const userIDs = [senderID, receiverID].sort();
    const conversation = await Conversation.findOne({ userIDs });
    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }
    // Decrypt messages
    const decryptedMessages = conversation.messages.map((msg) => ({
      _id: msg._id,
      senderID: msg.senderID,
      message: decrypt(msg.message),
      createdAt: msg.createdAt,
    }));
    // Sort by createdAt
    decryptedMessages.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    return res.status(200).json({ messages: decryptedMessages });
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching messages", error });
  }
};
