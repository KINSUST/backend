const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { allAdministrator, singleAdministrator, deleteSingleAdministrator, updateSingleAdministrator, createAdministrator, administratorLogin, getLoggedInAdministrator, logout, passwordRecover, codeCheck, passwordChange } = require("../controllers/administrator.controllers");

const router = express.Router();

//all advisors
router.route("/")
.get( authMiddleware,allAdministrator)
.post(createAdministrator)

// login
router.route('/login').post(administratorLogin)

// loggedIn data
router.route('/me').get(getLoggedInAdministrator)
// logout 
router.route('/logout').get(logout)

// email search 
router.route("/identify").post(passwordRecover);

// code check
router.route("/code-check").post(codeCheck);
// password change
router.route("/password-change").post(passwordChange);

// single advisor 
router
  .route("/:id")
  .get(authMiddleware, singleAdministrator) 

  .put(authMiddleware, updateSingleAdministrator)
  .patch(authMiddleware, updateSingleAdministrator)
  .delete(authMiddleware, deleteSingleAdministrator);

// export route
module.exports = router;
