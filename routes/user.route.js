const express = require("express");
const { allUser, singleUser,  deleteSingleUser, updateSingleUser, loginUser, logoutUser, getLoggedInUser, registerByToken, userRegister, createUser, singleUserByEmail, userVerifyCodeCheck, passwordRecover, forgottenPasswordChange, passwordChange,  } = require("../controllers/user.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const { registerToken } = require("../controllers/common.controllers");

const router = express.Router();
  
//all users
router.route('/')
.get(authMiddleware,allUser)   
.post(authMiddleware,createUser)
// logged user
router.route('/me').get(getLoggedInUser)



// pas
// user register
router.route("/register-token").post(registerByToken);
router.route("/code-check").post(userVerifyCodeCheck);
router.route("/recover").post(passwordRecover);
router.route("/password-change").post(forgottenPasswordChange);
router.route("/login-password-change").post(passwordChange);

router.route('/register').post(userRegister)
//user login 
router.route("/login").post(loginUser);

router.route('/logout').get(authMiddleware,logoutUser)
  
// single user 
router.route('/:id')
.get(authMiddleware,singleUser)
.delete(authMiddleware,deleteSingleUser)
.put(authMiddleware,updateSingleUser)
.patch(authMiddleware,updateSingleUser)




// export route
module.exports=router;