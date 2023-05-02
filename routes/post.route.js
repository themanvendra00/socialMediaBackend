const express = require("express");
const { PostModel } = require("../models/post.model");
const { UserModel } = require("../models/user.model");

const postRouter = express.Router();

// This endpoint returns a list of all posts.
postRouter.get("/", async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.send({ message: "Here is the lists of all the post!", posts });
  } catch (error) {
    console.log("Error occurred while listing all the posts!");
    console.log(error);
  }
});

// This endpoint allows the user to create a new post.
postRouter.post("/", async (req, res) => {
  const { user, text, image } = req.body;
  try {
    const post = new PostModel({
      user,
      text,
      image,
    });
    await post.save();

    const userPOST = await UserModel.findById(user);
    userPOST.posts.push(post);
    await userPOST.save();
    res.send({ message: "Post added successfully", post });
  } catch (error) {
    console.log("Error occuerred while posting!");
    console.log(error);
  }
});

// This endpoint allows users to update the text or image of a specific post identified by its ID.
postRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { text, image } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (!post) {
      res.send({ error: "Post not found!" });
    }
    if (text) {
      post.text = text;
    }
    if (image) {
      post.image = image;
    }
    await post.save();
    res.send({ message: "Post updated successfully", post });
  } catch (error) {
    console.log("Error occurred while updating the text and image of post!");
    console.log(error);
  }
});

// This endpoint allows users to delete a specific post identified by its ID.
postRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findByIdAndDelete(id);
    res.send({ message: "Post deleted successfully!" });
  } catch (error) {
    console.log("Error occurred while deleteing the post");
    console.log(error);
  }
});

// This endpoint allows users to like a specific post identified by its ID.
postRouter.post("/:id/like", async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (!post) {
      res.send({ error: "Post not found!" });
    }

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      res.send({ message: "You have already liked this post" });
    }

    post.likes.push(userId);
    await post.save();
    res.send({ message: "Post liked successfully!" });
  } catch (error) {
    console.log("Error occurred while liking the post");
    console.log(error);
  }
});

// This endpoint allows users to comment on a specific post identified by its ID.
postRouter.post("/:id/comment", async (req, res) => {
  const id = req.params.id;
  const { user, text } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (!post) {
      res.send({ error: "Post not found!" });
    }
    const comment = { user, text };
    post.comments.push(comment);
    await post.save();
    res.send({ message: "Comment added successfully!" });
  } catch (error) {
    console.log("Error occurred while commenting on the post");
    console.log(error);
  }
});

// This endpoint return the details of a specific post identified by its ID.
postRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findById(id);
    if (!post) {
      res.send({ error: "Post not found!" });
    }
    res.send({ post });
  } catch (error) {
    console.log("Error occured while listing the post with specific id!");
    console.log(error);
  }
});

module.exports = {
  postRouter,
};
