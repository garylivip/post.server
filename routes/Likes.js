const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const verifyToken = require("../middlewares/AuthMiddleware");

router.get("/", (req, res) => {
  Likes.findAll()
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch((error) => {
      res.status(500).send("Error: " + error.message);
    });
});

router.post("/", verifyToken, (req, res) => {
  const like = req.body; // { PostId: 1 }
  like.UserId = req.user.id;

  Likes.findOne({ where: { PostId: like.PostId, UserId: like.UserId } })
    .then((existingLike) => {
      if (existingLike) {
        return existingLike.destroy().then(() => {
          res.status(200).send({ liked: false });
        });
      } else {
        return Likes.create(like).then((result) => {
          res.status(201).send({ liked: true, result });
        });
      }
    })
    .catch((error) => {
      res.status(500).send("Error: " + error.message);
    });
});

module.exports = router;
