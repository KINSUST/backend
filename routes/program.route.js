const express = require("express");
const router = express.Router();

const {
  allProgram,
  createProgram,
  singleProgram,
  deleteProgram,
  updateProgram,
} = require("../controllers/program.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.route("/").get(allProgram).post(authMiddleware,createProgram);

router
  .route("/:id")
  .get(authMiddleware,singleProgram)
  .delete(authMiddleware,deleteProgram)
  .put(authMiddleware,updateProgram)
  .patch(authMiddleware,updateProgram);

//export routes
module.exports = router;
