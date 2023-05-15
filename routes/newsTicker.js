const express = require("express");
const router = express.Router();
const {
  newsTicker,
  createNews,
  deleteNews,
  singleNews,
} = require("../controllers/news.controllers");

// all post data routes
router.get("/", newsTicker);

//create single post routes
router.post("/", createNews);

// slider news delete
router.delete("/:id", deleteNews);

//single news

router.get("/news-ticker/:id", singleNews);

//export routes
module.exports = router;
