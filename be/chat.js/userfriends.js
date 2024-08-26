const userfriend = require("../models/userfriend")
const Users = require('../models/registermodel')

// Add Friends
exports.addFriends = async (req, res) => {
    try {
        const { _id, logeduser } = await req.body
        const owner = await Users.findById({ _id: logeduser })
        const existrequest = await userfriend.findOne({ owner: logeduser, friendID: _id })
        if (existrequest) {
            return res.status(400).json({
                msg: "Request Has Already Sent"
            })
        }

        const adduserfriend = await Users.findOne({ _id })
        if (!adduserfriend) {
            return res.json({
                msg: 'User Not Found'
            })
        }
        const check = await owner.friends.some(id => id._id == _id)
        if (check) {
            return res.json({
                msg: 'User Already Your Friend'
            })
        }
        const newfriend = new userfriend({
            owner: logeduser,
            friendID: _id,
            userfriends: adduserfriend,
            request: false
        })
        await newfriend.save()

        return res.json({
            msg: 'Request Send Successfully'
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'User Not Found'
        })
    }
}
// User Friends
exports.getUserFriends = async (req, res) => {
    try {
        const currentuser = req.user.id
        const currentuserfriends = await Users.findById({ _id: currentuser })
        const userFriends = currentuserfriends.friends
        return res.json(userFriends)
    } catch (error) {
        return res.status(400).json({
            msg: 'Fata Not Found'
        })
    }
}

// All Users Of This Application
exports.allUsers = async (req, res) => {
    try {
        const users = await Users.find({ verified: true })
        const allusers = await users.filter(data => {
            return data._id != req.user.id
        })
        if (!users) {
            return res.status(401).json({
                msg: 'Data Not Found'
            })
        }
        return res.json(allusers)
    } catch (error) {
        return res.status(400).json({
            error,
            msg: 'Authentification Error Please Log In Again  Or Refresh The Page'
        })
    }
}
// User Profile
exports.userProfile = async (req, res) => {
    try {
        const users = await Users.findById({ _id: req.user.id })
        if (!users) {
            return res.json({
                msg: 'Token Not Found'
            })
        }
        const myfriends = await users.friends
        return res.status(201).json({
            user: users,
            myfriends,
            msg: 'Token Verified'
        })
    } catch (err) {
        return res.json(err)
    }
}

exports.acceptRequest = async (req, res) => {
    try {
        const { requestUser, acceptedUser } = await req.body
        const requesteduser = await Users.findById({ _id: requestUser })

        if (!requestUser) {
            return res.json({
                msg: 'User Not Found'
            })
        }

        const friend = await Users.findById({ _id: acceptedUser })
        if (!friend) {
            return res.json({
                msg: 'User Not Found'
            })
        }
        await userfriend.findOneAndDelete({ owner: requestUser, friendID: acceptedUser })
        await userfriend.findOneAndDelete({ owner: acceptedUser, friendID: requestUser })
        await Users.findByIdAndUpdate(
            { _id: requestUser },
            { $push: { friends: friend } }
        )
        await Users.findByIdAndUpdate(
            { _id: acceptedUser },
            { $push: { friends: requesteduser } }
        )

        return res.status(202).json({
            msg: 'Successfully Added In Your Friend List'
        })
    } catch (error) {
        return res.json(error)
    }
}


exports.friend_request = async (req, res) => {
    try {
        const user = req.user.id
        const request = await userfriend.find({ friendID: user })
        const all = await request.map(data => { return data.owner })
        const friendrequestsender = await Users.find({ _id: all })
        return res.json(friendrequestsender)
    } catch (error) {
        return res.status(400).res.json(error)
    }
}
// delete friend request
exports.deleteRequest = async (req, res) => {
    try {
        const requestedUser = await req.params.requestedUser;
        const acceptedUser = await req.params.acceptedUser;
        await userfriend.findOneAndDelete({ owner: requestedUser, friendID: acceptedUser })
        await userfriend.findOneAndDelete({ owner: acceptedUser, friendID: requestedUser })
        return res.status(202).json({
            msg: "Friend Request Deleted"
        })
    } catch (error) {
        return res.json(error)
    }
}
