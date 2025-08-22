const userfriend = require("../models/userfriend");
const Users = require("../models/registermodel");

// Add Friends
exports.addFriends = async (req, res) => {
  try {
    const { _id, logeduser } = req.body;
    const owner = await Users.findById(logeduser);
    if (!owner) {
      return res.status(404).json({ msg: "Logged in user not found" });
    }
    const existrequest = await userfriend.findOne({
      owner: logeduser,
      friendID: _id,
    });
    if (existrequest) {
      return res.status(400).json({ msg: "Request Has Already Sent" });
    }
    const adduserfriend = await Users.findById(_id);
    if (!adduserfriend) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    const check =
      owner.friends && owner.friends.some((id) => id.toString() === _id);
    if (check) {
      return res.status(400).json({ msg: "User Already Your Friend" });
    }
    const newfriend = new userfriend({
      owner: logeduser,
      friendID: _id,
      userfriends: adduserfriend,
      request: false,
    });
    await newfriend.save();
    return res.status(201).json({ msg: "Request Sent Successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "User Not Found", error });
  }
};
// User Friends
exports.getUserFriends = async (req, res) => {
  try {
    const currentuser = req.user.id;
    const currentuserfriends = await Users.findById(currentuser);
    if (!currentuserfriends) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    const userFriends = currentuserfriends.friends || [];
    // Fetch friend details and only expose name, email, gender
    const friendsDetails = await Promise.all(
      userFriends.map(async (friendId) => {
        const friend = await Users.findById(friendId);
        if (friend) {
          return {
            name: friend.name,
            email: friend.email,
            gender: friend.gender,
            _id: friend._id,
          };
        }
        return null;
      })
    );
    return res.json(friendsDetails.filter(Boolean));
  } catch (error) {
    return res.status(500).json({ msg: "Data Not Found", error });
  }
};

// All Users Of This Application
exports.allUsers = async (req, res) => {
  try {
    const users = await Users.find({ verified: true });
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "Data Not Found" });
    }
    const allusers = users.filter(
      (data) => data._id.toString() !== req.user.id
    );
    return res.json(allusers);
  } catch (error) {
    return res.status(500).json({
      error,
      msg: "Authentication Error. Please log in again or refresh the page.",
    });
  }
};
// User Profile
exports.userProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Token Not Found" });
    }
    const myfriends = user.friends || [];
    // Only expose friend name, email, gender
    const friendsDetails = await Promise.all(
      myfriends.map(async (friendId) => {
        const friend = await Users.findById(friendId);
        if (friend) {
          return {
            name: friend.name,
            email: friend.email,
            gender: friend.gender,
          };
        }
        return null;
      })
    );
    // Only expose user name, email, gender
    const userData = {
      name: user.name,
      email: user.email,
      gender: user.gender,
    };
    return res.status(200).json({
      user: userData,
      myfriends: friendsDetails.filter(Boolean),
      msg: "Token Verified",
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { requestUser, acceptedUser } = req.body;
    const requesteduser = await Users.findById(requestUser);
    if (!requesteduser) {
      return res.status(404).json({ msg: "Requested user not found" });
    }
    const friend = await Users.findById(acceptedUser);
    if (!friend) {
      return res.status(404).json({ msg: "Accepted user not found" });
    }
    await userfriend.findOneAndDelete({
      owner: requestUser,
      friendID: acceptedUser,
    });
    await userfriend.findOneAndDelete({
      owner: acceptedUser,
      friendID: requestUser,
    });
    await Users.findByIdAndUpdate(requestUser, {
      $push: { friends: friend._id },
    });
    await Users.findByIdAndUpdate(acceptedUser, {
      $push: { friends: requesteduser._id },
    });
    return res
      .status(200)
      .json({ msg: "Successfully Added In Your Friend List" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.friend_request = async (req, res) => {
  try {
    const user = req.user.id;
    const request = await userfriend.find({ friendID: user });
    const all = request.map((data) => data.owner);
    const friendrequestsender = await Users.find({ _id: { $in: all } });
    return res.json(friendrequestsender);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// delete friend request
exports.deleteRequest = async (req, res) => {
  try {
    const requestedUser = req.params.requestedUser;
    const acceptedUser = req.params.acceptedUser;
    await userfriend.findOneAndDelete({
      owner: requestedUser,
      friendID: acceptedUser,
    });
    await userfriend.findOneAndDelete({
      owner: acceptedUser,
      friendID: requestedUser,
    });
    return res.status(200).json({ msg: "Friend Request Deleted" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
