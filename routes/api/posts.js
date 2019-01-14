const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Post Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Load Validation
const validatePostInput = require("../../validation/post");

// @route GET api/posts/test
// @desc Tests posts route
// @access public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route GET api/posts
// @desc  GET all posts
// @access public
router.get("/", (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: "No Posts Exist" }));
});

// @route GET api/posts/:id
// @desc  GET post by id
// @access public
router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err =>
            res.status(404).json({ nopostfound: "No Post Exist with this id" })
        );
});

// @route POST api/posts
// @desc Create Posts
// @access private
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            return res.status(400).json({ errors });
        }
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });

        newPost.save().then(post => res.json(post));
    }
);

// @route DELETE api/posts/:id
// @desc delete Post
// @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res
                            .status(401)
                            .json({ notauthorized: "You are not authorized" });
                    }

                    //Delete
                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err =>
                    res
                        .status(404)
                        .json({ postnotfound: "No post with this id exist" })
                );
        });
    }
);

module.exports = router;
