const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { allAdvisor, singleAdvisor, deleteSingleAdvisor, updateSingleAdvisor, createAdvisor } = require("../controllers/advisor.controlllers");
const router = express.Router();

//all advisors
router.route("/")
.get(allAdvisor)

//add advisor
.post(authMiddleware,createAdvisor)

// single advisor
router
  .route("/:id")
  .get(authMiddleware, singleAdvisor)
  .delete(authMiddleware, deleteSingleAdvisor)
  .put(authMiddleware, updateSingleAdvisor)
  .patch(authMiddleware, updateSingleAdvisor);

// export route
module.exports = router;
