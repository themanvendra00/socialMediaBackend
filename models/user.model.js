const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dob: Date,
  bio: String,
  posts: [{ type: ObjectId, ref: "Post" }],
  friends: [{ type: ObjectId, ref: "User" }],
  friendRequests: [{ type: ObjectId, ref: "User" }],
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
