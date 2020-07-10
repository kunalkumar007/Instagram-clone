const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("./post.schema");
const verify = require("./token.jwt");

router.get("/all-post", (req, res) => {
  Post.find()
    .populate("postedby", "_id name") //shows additional info with postedby ...
    .then((posts) => res.json({ post: posts }))
    .catch((err) => res.status(400).json(err));
});

router.post("/create-post", verify, (req, res) => {
  const { title, body, url } = req.body;
  if (!title || !body) return res.status(422).json("Enter all fields.");

  // console.log(req.user);
  // res.send("ok");
  const post = new Post({
    title,
    body,
    photo:url,
    postedby: req.user,
  });
  post
    .save()
    .then((result) => res.json({ post: result }))
    .catch((err) => res.status(400).json("post not saved"));
});

router.get("/my-post", verify, (req, res) => {
  Post.find({ postedby: req.user._id })
    .populate("postedby", "_id name")
    .then((data) => res.json({ myPosts: data }))
    .catch((err) => res.status(400).json({ err }));
});
module.exports = router;
