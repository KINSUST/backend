const express = require("express");
const router = express.Router();
const {
  allPost,
  createPost,
  singlePost,
  deletePost,
  updatePost,
} = require("../controllers/post.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.route("/").get(allPost).post(authMiddleware, createPost);

//single route
router
  .route("/:slug")
  .get(authMiddleware, singlePost)
  .delete(authMiddleware, deletePost)
  .put(updatePost)
  .patch(updatePost);

//export routes
module.exports = router;
