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

// @route POST api/posts/like/:id
// @desc like Post
// @access private
router.post(
    "/like/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length > 0
                    ) {
                        return res.status(400).json({
                            alreadyliked: "You have already liked this"
                        });
                    }

                    post.likes.unshift({ user: req.user.id });

                    post.save().then(post => req.json(post));
                })
                .catch(err =>
                    res
                        .status(404)
                        .json({ postnotfound: "No post with this id exist" })
                );
        });
    }
);

// @route DELETE api/posts/unlike/:id
// @desc like Post
// @access private
router.delete(
    "/unlike/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(
                            like => like.user.toString() === req.user.id
                        ).length === 0
                    ) {
                        return res.status(400).json({
                            notliked: "You have not till liked this"
                        });
                    }

                    //GET remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    post.likes.splice(removeIndex, 1);
                    post.save().then(post => res.json(post));
                })
                .catch(err =>
                    res
                        .status(404)
                        .json({ postnotfound: "No post with this id exist" })
                );
        });
    }
);

// @route POST api/posts/comment/:id
// @desc post comment
// @access private
router.post(
    "/comment/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                };

                //Add to comments array
                post.comments.unshift(newComment);
                post.save().then(post => res.json(post));
            })
            .catch(err =>
                res
                    .status(404)
                    .json({ postnotfound: "No post with this id exist" })
            );
    }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete comment
// @access private
router.delete(
    "/comment/:id/:comment_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                if (
                    post.comments.filter(
                        comment =>
                            comment._id.toString() === req.params.comment_id
                    ).length === 0
                ) {
                    return res
                        .status(400)
                        .json({ commentnotexist: "Comment does not exist" });
                }

                //get remove index
                const removeIndex = post.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id);

                post.comments.splice(removeIndex, 1);
                post.save().then(post => res.json(post));
            })
            .catch(err =>
                res
                    .status(404)
                    .json({ postnotfound: "No post with this id exist" })
            );
    }
);

module.exports = router;
