const express = require("express");
const router = express.Router();
const {
  getAllSlider,
  singleSlider,
  addSlider,
  deleteSlider,
  updateSlider,
} = require("../controllers/slider.controllers");
const authMiddleware = require("../middlewares/auth.middleware");


// routes
router.route('/')
.get( getAllSlider)
.post(authMiddleware,addSlider);

router.route('/:id')
.get(authMiddleware,singleSlider)
.delete(authMiddleware,deleteSlider)
.put(authMiddleware,updateSlider)
.patch(authMiddleware,updateSlider)

//export router
module.exports = router;
