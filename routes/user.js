var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
const user=require('../model/users')
const bcrypt=require('bcrypt')
const usercontroller=require('../controller/usercontroller')
const userMiddleware=require('../middleware/userMiddleware')
const useraccountcontroller=require('../controller/user/useraccountcontroller')
const cart = require('../controller/locals')
const {userRegistration}=require('../middleware/validation')


const seq = userMiddleware.seq


router.use(cart)



router.get('/user_signin',usercontroller.user_signin );
router.get('/user_registration',usercontroller.user_registration)
router.post('/user_registration',userRegistration,usercontroller.user_registrationpost)
router.get('/user_logout',seq,usercontroller.user_logout)
router.get('/cart',seq,usercontroller.user_cart)
router.get('/wishlist',seq,usercontroller.user_wishlist)
router.get('/forgot_password',userMiddleware.forgetpasswordseq,usercontroller.user_forgotpassword)
router.post('/forgot_password',userMiddleware.forgetpasswordseq,usercontroller.user_forgotpasswordPOST)
router.post('/forgot_password/check',userMiddleware.forgetpasswordseq,usercontroller.user_checkforgotpasswordPOST)
router.get('/wishlist/addwishlist/:id/:v',seq,usercontroller.user_wishlistadd)
router.get('/wishlist/removewishlist/:id/:v',seq,usercontroller.user_wishlistremove)
router.get('/cart/addtocart/:id/:v/:qty',seq,usercontroller.user_cartadd)
router.get('/cart/removecart/:id/:v',seq,usercontroller.user_cartremove)
router.get('/rateproduct/:id/:v',seq,usercontroller.user_rateproduct)
router.get('/checkout',seq,usercontroller.user_checkout)
router.post('/createorder',seq,usercontroller.user_createorder)
router.get('/order/pending/orderdata/:id',seq,usercontroller.order_payment_data)


// account related
router.use(userMiddleware.user_accountseq)

    // dashboard
    router.get('/account/dashboard',seq,useraccountcontroller.user_dashboard)

    // order
    router.get('/account/order',seq,useraccountcontroller.user_order)
    router.get('/account/order/:id',seq,useraccountcontroller.order_details)
    router.get('/account/order/cancel/:id',seq,useraccountcontroller.user_ordercancel)
    router.post('/account/order/return/:id',seq,useraccountcontroller.user_orderreturn)
    router.get('/account/order/invoice/:id',seq,useraccountcontroller.order_invoice)

    // address
    router.get('/account/address',seq,useraccountcontroller.user_address)
    router.post('/account/address/addnewaddress',seq,useraccountcontroller.user_addnewaddress)
    router.get('/account/address/delete/:id',seq,useraccountcontroller.user_deleteaddress)
    router.post('/account/address/edit/:id',seq,useraccountcontroller.user_editaddress)
    router.get('/account/address/details/:id',seq,useraccountcontroller.address_details)
    router.get('/account/accountdetails',seq,useraccountcontroller.user_accountdetails)

router.post('/changepassword',seq,usercontroller.user_changepassword)


module.exports = router;
