const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { postRouter } = require("./routes/post.route");
require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Welcome to social media app backend 😁" });
});

app.use("/users", userRouter);
app.use("/posts", postRouter)

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to database");
  } catch (error) {
    console.log("Error occurred while connecting to database");
    console.log(error);
  }
  console.log(`App is running on port: http://localhost:${port}`);
});
