const express =require('express');
const { passwordRecover, codeCheck, passwordChange, registerToken } = require('../controllers/common.controllers');


const router = express.Router();


// email recover
router.route('/recover').post(passwordRecover)

// password change
router.route("/code-check").post(codeCheck);
// password change
router.route("/password-change").post(passwordChange);
// register token
router.route('/register').post(registerToken)


module.exports =router