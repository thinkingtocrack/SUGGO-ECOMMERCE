const express=require('express')
const router=express.Router()
const otpFunction = require('../controller/otp/otpcontroller')
const usercontroller=require('../controller/usercontroller')
const {otpseq}=require('../middleware/userMiddleware')

router.get('/user/:id',otpFunction.renderotp)
router.get('/sendotp/:id',otpFunction.send_otp)
router.post('/user/:id',usercontroller.user_verify)


module.exports=router