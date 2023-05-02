const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");

const userRouter = express.Router();

// End point to get all the users.
userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send({ message: "List of all registered users", users });
  } catch (error) {
    console.log("Error occurred while listing all the users");
    console.log(error);
  }
});

// End point to register a user.
userRouter.post("/register", async (req, res) => {
  const { name, email, password, dob, bio } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({ name, email, password: hash, dob, bio });
        await user.save();
        res.send({ message: "User registered success!", data: user });
      }
    });
  } catch (error) {
    console.log("Error occurred while registering the user!");
    console.log(error);
  }
});

// End point to get the friend list of specific user.
userRouter.get("/:id/friends", async (req, res) => {
  const ID = req.params.id;
  try {
    const user = await UserModel.findById(ID).populate("friends");
    res.send({
      message: `List of all friends of user with id:${ID}`,
      friends: user.friends,
    });
  } catch (error) {
    console.log(
      `Error occurred while listing all the friends list of user with id:${ID}`
    );
    console.log(error);
  }
});

// End point to make friend request.
userRouter.post("/:id/friends", async (req, res) => {
  const ID = req.params.id;
  const { friendID } = req.body;
  try {
    const user = await UserModel.findById(ID);
    if (!user) {
      res.send({ error: "User not found!" });
    }

    const friend = await UserModel.findById(friendID);
    if (!friend) {
      res.send({ error: "Friend not found!" });
    }

    const hasSentFR = user.friendRequests.some((friendRequest) =>
      friendRequest.equals(friendID)
    );
    if (hasSentFR) {
      return res.send({
        message: "You have already sent a friend request to this user!",
      });
    }

    const isAlreadyF = user.friends.some((friendShip) =>
      friendShip.equals(friendID)
    );
    if (isAlreadyF) {
      return res.send({ message: "You are already friend with this user!" });
    }

    user.friendRequests.push(friendID);
    await user.save();
    res.send({ message: "Friend request sent successfully!" });
  } catch (error) {
    console.log("Error occurred while sending the friend request!");
    console.log(error);
  }
});

// End point to accept friend request.
userRouter.patch("/:id/friends/:friendId", async (req, res) => {
  const ID = req.params.id;
  const friendID = req.params.friendId;
  try {
    const user = await UserModel.findById(ID);
    const friend = await UserModel.findById(friendID);

    if (!user || !friend) {
      res.send({ error: "User or friend not found!" });
    }

    if (!user.friendRequests.includes(friendID)) {
      res.send({ error: "Friend request not found!" });
    }

    user.friends.push(friend);
    user.friendRequests.splice(user.friendRequests.indexOf(friend), 1);

    friend.friends.push(user);
    await user.save();
    await friend.save();
    res.send({ message: "Friend request acceppted successfully!" });
  } catch (error) {
    console.log("Error occurred while acceppting the friend request!");
    console.log(error);
  }
});

module.exports = {
  userRouter,
};
