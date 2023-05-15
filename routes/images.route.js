const express =require('express')
const { advisorsImages, advisorsImageDelete, slidersImages, slidersImageDelete, programImages, programImageDelete, usersImages, usersImageDelete, postImages, postImageDelete } = require('../controllers/images.controllers')


const router=express.Router()

// advisors
router.route('/advisors')
.get(advisorsImages)
router.route("/advisors/:name").delete(advisorsImageDelete);

// slider
router.route("/slider").get(slidersImages);
router.route("/slider/:name").delete(slidersImageDelete);

// slider
router.route("/program").get(programImages);
router.route("/program/:name").delete(programImageDelete);
// users
router.route("/users").get(usersImages);
router.route("/users/:name").delete(usersImageDelete);
// post
router.route("/post").get(postImages);
router.route("/post/:name").delete(postImageDelete);



module.exports=router

