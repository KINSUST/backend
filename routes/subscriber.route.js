const express=require('express')
const { allSubscriber, addSubscriber, updateSubscriber, deleteSubscriber } = require('../controllers/subscriber.controllers')
const authMiddleware = require('../middlewares/auth.middleware')
const router=express.Router()



router.route('/').get(authMiddleware,allSubscriber)
.post(addSubscriber)
router.route('/:id').put(authMiddleware,updateSubscriber)
router.route('/:id').patch(authMiddleware,updateSubscriber)
router.route('/:id').delete(authMiddleware,deleteSubscriber)


//export router
module.exports=router