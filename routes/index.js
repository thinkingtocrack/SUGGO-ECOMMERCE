const express=require('express')
const router=express.Router()
const cart=require('../controller/locals')
const indexcontroller=require('../controller/indexcontroller')
const userMiddleware=require('../middleware/userMiddleware')

const shopseq = userMiddleware.shopseq
router.use(shopseq)
router.use(cart)



router.get('/', indexcontroller.homepage)
router.get('/shop',indexcontroller.shop)
router.get('/shop/view/:id/:v',indexcontroller.productpage)



module.exports=router