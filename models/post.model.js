const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const postSchema = mongoose.Schema({
  user: { type: ObjectId, ref: "User" },
  text: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const PostModel = mongoose.model("Post", postSchema);

module.exports = {
  PostModel,
};
