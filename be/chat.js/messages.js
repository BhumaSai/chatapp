const messagemodel = require("../models/messagemodel")

module.exports.savemessages = async (req, res) => {
    try {
        const { message, senderID, receiverID } = await req.body;
        const newmessage = new messagemodel({
            message, senderID, receiverID
        })
        await newmessage.save()
        return res.status(202).json({
            msg: 'message saved successfully'
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'error'
        })
    }
}

module.exports.getmessages = async (req, res) => {
    try {
        const { senderID, receiverID } = await req.params;
        const allconversation = await messagemodel.find({ senderID, receiverID })
        const getall = await messagemodel.find({ senderID: receiverID, receiverID: senderID })
        const messages = []
        const maping = await allconversation.map(data => {
            return messages.push(data)
        })
        const all = await getall.map(data => {
            return messages.push(data)
        })
        const allmsg = await messages.map((data) => {
            return data
        })
        const sorted = messages.sort()
        return res.status(202).json({ messages })
    } catch (error) {
        return res.json(error)
    }
}

