const user = require('../model/users')
const bcrypt = require('bcrypt')
const otpFunction=require('../controller/otp/otpcontroller')
const {validationResult}=require('../middleware/validation')
const product = require('../model/product')
const order=require('../model/order')
const mongoose=require('mongoose')
const crypto=require('crypto')
const coupon=require('../model/coupon')

const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.razor_key,
  key_secret: process.env.razor_secret,
});



async function otpsend(a,otpx){
    const params = {
        to: a,
        OTP: otpx
    }
    await otpFunction.sendMail(params)
}


const user_signin = (req, res) => {
    try {
        if (req.session.user) {
            res.redirect('/')
        } else {
            if (req.query.error == 'true') {
                res.render('./user/login.ejs', { error: true });
            } else {
                res.render('./user/login.ejs');
            }
        }
    } catch (error) {
        console.log(error)
    }
    
}


const user_registration = (req, res) => {
    try {
        if (req.query.user == 'exist') {
            res.render('./user/signup.ejs', { error: true })
        } else {
            res.render('./user/signup.ejs')
        }
    } catch (error) {
        console.log(error)
    }
}

const user_registrationpost = async (req, res) => {
    try {
        const result=validationResult(req)
        if(!result.isEmpty()){
            res.json('hai')   
        }else{
            const data = req.body
            data.password = await bcrypt.hash(data.password, 10)
            condition = await user.find({ email: req.body.email })
            if (condition[0]) {
                res.redirect('/user/user_registration?user=exist')
            } else { 
                const {_id}=await user.create(data)
                res.redirect(`/otpverification/user/${_id}`)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const user_logout = (req, res) => {
    try {
        if (req.session.user) {
            delete req.session.user
        }
        if (req.session.email) {
            delete req.session.email
        }
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

const user_forgotpassword = (req, res) => {
    try {
        res.render('./common/forgotpassword', { error: req.query.error })
    } catch (error) {
        res.send('error')
    }
}

const user_forgotpasswordPOST=async(req,res)=>{
    try {
        const {email}=req.body
        const userx= await user.findOne({email:email}).select('email status')
        if(userx?.email && userx?.status){
        otpadmin = otpFunction.otp()
        await otpsend(email, otpadmin)
        req.session.forgotpassword=otpadmin
        req.session.email=email
        res.render('./common/forgotpasswordotp')
        }else {
        res.redirect('/user/forgot_password?error=true')
        }
    } catch (error) {
        res.send(error)
    }
}

const user_checkforgotpasswordPOST=async(req,res)=>{
    try {
        if(req.body.otp==req.session.forgotpassword){
            let newpassword=await bcrypt.hash(req.body.password, 10)
            let userx= await user.find({email:req.session.email}).select('password')
            console.log(userx)
            userx[0].password=newpassword
            await userx[0].save()
            res.json({
                otp:true
            })
        }else{
            res.json({
                otp:false
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            error:error
        })
    }
}

const user_verify=async(req,res)=>{
    try {
        const data=await user.findById(req.params.id).select('otp status')
        if(req.body.otp==data.otp.otpcode){
        data.otp.status=true
        await data.save()
        res.json({
            otp:true
        })
        }else{
        res.json({
            otp:false
        })
        }
    } catch (error) {
        res.send(error)
    }
}


const user_wishlist=async(req,res)=>{
    try {
        const wishlist=await user.findOne({email:req.session.email}).select('wishlist')
        let productid=[]
        let varientid=[]
        wishlist.wishlist.forEach(element=>{
            productid.push(element.productid)
            varientid.push(Number(element.varientid))
        })
        const productlist=await product.aggregate([{$match:{_id:{$in:productid.map(id => new mongoose.Types.ObjectId(id))}}},{$unwind:'$varient'},{$match:{'varient.id':{$in:varientid}}}])
        res.locals.wishlist=productlist
        res.render('./user/wishlist.ejs')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const user_wishlistadd=async(req,res)=>{
    try {
        let productid=req.params.id
        let varientid=req.params.v
        let b=await user.updateMany({email:req.session.email}, { $addToSet: { wishlist: {productid:productid ,varientid:varientid}} })
        res.json({
            added:true,
            exists:(b.modifiedCount==0)?true:false,
        })
    } catch (error) {
        res.json({
            added:false
        })
    }
}
const user_wishlistremove=async(req,res)=>{
    try {
        let productid=req.params.id
        const varientid=req.params.v
        let b=await user.updateOne({ email:req.session.email }, { $pull: { wishlist: {productid:productid,varientid:varientid}} })
        res.json({
            added:true,
            exists:(b.modifiedCount==0)?true:false,
        })
    } catch (error) {
        res.json({
            added:false
        })
    }
}



const user_cart=async(req,res)=>{
    try {
        const cartlist=await user.find({email:req.session.email}).select('cart')
        const varientidlist=[]
        const cartlistid=cartlist[0].cart.map((a)=>{
            varientidlist.push(Number(a.varientid))
            return a.productid
        })
        const cartlistqty=cartlist[0].cart.map(a=>a.qty)
        const productlist=await product.aggregate([{$match:{_id:{$in:cartlistid.map(id => new mongoose.Types.ObjectId(id))}}},{$unwind:'$varient'},{$match:{'varient.id':{$in:varientidlist}}}])
        res.locals.cartlist=productlist
        res.locals.cartqtylist=cartlistqty
        res.render('./user/cart.ejs')
    } catch (error) {
        console.log(error)
    }
}

const user_cartadd=async(req,res)=>{
    try {
        let productid=req.params.id
        let qty=req.params.qty
        let varientid=req.params.v
        let existingProduct = await user.updateMany(
            {
                email: req.session.email,
                cart: { $elemMatch: { productid: productid ,varientid:varientid} }
            },
            {
                $set: { "cart.$.qty": qty }
            }
        );
        if(existingProduct.modifiedCount === 0){
            var b=await user.updateMany({email:req.session.email}, { $addToSet: { cart: {productid:productid,qty:qty,varientid:varientid}} })
        }
        res.json({
            added:true,
            exists:(b?.modifiedCount==0)?true:false,
        })
    } catch (error) {
        console.log(error)
        res.json({
            added:false
        })
    }
}

const user_cartremove=async(req,res)=>{
    try {
        let productid=req.params.id
        let varientid=req.params.v
        let b=await user.updateOne({ email:req.session.email }, { $pull: { cart: {productid:productid ,varientid:varientid}} })
        res.json({
            added:true,
            exists:(b.modifiedCount==0)?true:false,
        })
    } catch (error) {
        res.json({
            added:false
        })
    }
}

const user_rateproduct=async(req,res)=>{
    const {id,v}=req.params
    await product.updateMany(
        {
            productId:id,
            varient: { $elemMatch: { id: Number(v)} }
        },
        {
            $addToSet: { "varient.$.review": {rate:Number(req.query.rate),review:req.query.review,user:req.session.email} }
        }
    
    )
    res.redirect(`/shop/view/${id}/${v}`)
}

const user_changepassword=async (req,res)=>{
    try {
        let data = req.body
        let userx = await user.findOne({ email: req.session.email }) 
        const check = await bcrypt.compare(data.old, userx.password)
        if(check){
            data.new =await bcrypt.hash(data.new,10)
            userx.password=data.new
            await userx.save()
            res.locals.passwordchanged=true
            res.redirect('/user/account/accountdetails')
        }else{
            res.locals.passworderror=true
            res.redirect('/user/account/accountdetails')
        }
    } catch (error) {
        console.log(error)
    }
}

const user_checkout=async(req,res)=>{
    try {
        if(req.query.type=='cart'){
            let userx = await user.findOne({ email: req.session.email })
            res.locals.wallet=userx.wallet
            let address=await user.aggregate([{$match:{email:req.session.email}},{$unwind:'$address'},{$project:{address:1}}])
            
            const cartlist=await user.find({email:req.session.email}).select('cart')
            const varientidlist=[]
            const cartlistid=cartlist[0].cart.map((a)=>{
                varientidlist.push(Number(a.varientid))
                return a.productid
            })
            const productlist=await product.aggregate([{$match:{_id:{$in:cartlistid.map(id => new mongoose.Types.ObjectId(id))}}},{$unwind:'$varient'},{$match:{'varient.id':{$in:varientidlist}}}])
            let totalprice=productlist.reduce((a,e)=>{
                return a+Number(e.varient.price)
            },0)
            if(totalprice<1000){
                totalprice=totalprice+100
            }
            res.locals.totalprice=totalprice

            res.locals.type='/user/createorder?type=cart'
            res.locals.address=address
            res.render('./user/checkout.ejs')
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const user_createorder=async(req,res)=>{
    try {
        const x=await user.findOne({email:req.session.email}).select('address cart wallet')
        const {payment,address}=req.body
        do{
            var orderid = crypto.randomInt(100000,999999);
            let z=await order.find({order:orderid})
            if(z.length==0){
                break;
            }
        }while(true)
        let deliver=x.address.filter((e)=>e.id==address)
        let cartlist=await user.find({email:req.session.email}).select('cart')
        const varientidlist=[]
        const cartlistid=cartlist[0].cart.map((a)=>{
            varientidlist.push(Number(a.varientid))
            return a.productid
        })
        const cartlistqty=cartlist[0].cart.map(a=>a.qty)
        let productlist=await product.aggregate([{$match:{_id:{$in:cartlistid.map(id => new mongoose.Types.ObjectId(id))}}},{$unwind:'$varient'},{$match:{'varient.id':{$in:varientidlist}}}])
        productlist=productlist.map((e,i)=>{
            e.qty=cartlistqty[i]
            return e
        })
        totalprice=cartlistqty.reduce((a,v,i)=>{
            return a+(v*productlist[i].varient.price)
        },0)
        if(totalprice<1000){
            totalprice=totalprice+100
        }
        let newprice={}
        if(req.body?.coupon){
            newprice=await coupon.findOne({coupon:req.body.coupon}).select('coupon discount')
            if(newprice){
                totalprice=Number(totalprice)-Number(newprice.discount)
            }
        }
        if(req.body?.wallet){
            if(x.wallet>=totalprice){
                x.wallet=Number(x.wallet)-Number(totalprice)
                totalprice=0
                x.save()
            }else{
                totalprice=Number(totalprice)-Number(x.wallet)
                x.wallet=0
                x.save()
            }
        }
        let data={
            user:req.session.email,
            order:orderid,
            items:productlist,
            status:{order:true,payment:false,return:{done:false}},
            paymentamount:totalprice,
            address:deliver[0],
            paymentmethod:payment,
            coupon:newprice,
        }
        if(payment=='cod' || totalprice==0){
            data.paymentmethod='cod'
            await order.create(data)
            cartlist[0].cart=[]
            await cartlist[0].save()
            res.json({link:`/user/account/order/${data.order}`,payment:totalprice})
        }else if(payment=='online'){
            let p=await instance.orders.create({
                amount: Number(data.paymentamount*100),
                currency: "INR",
                receipt: `${data.order}`,
                })
            if(p?.error){
                res.json(p.error)
            }else{
                data.online={order_id:p.id}
                await order.create(data)
                cartlist[0].cart=[]
                await cartlist[0].save()
                p.user=await user.findOne({email:req.session.email}).select('email phone name')
                res.json(p)
            }
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const order_payment_data=async (req,res)=>{
    let orderx=await order.findOne({user:req.session.email,order:req.params.id})
    let k=await instance.orders.fetch(orderx.online.order_id)
    k.user=await user.findOne({email:req.session.email}).select('email phone name')
    res.json(k)
}

module.exports = {order_payment_data,user_createorder,user_checkout,user_changepassword,user_rateproduct,user_checkforgotpasswordPOST,user_forgotpasswordPOST,user_wishlistremove,user_cartremove,user_wishlist,user_cart,user_cartadd,user_wishlistadd, user_signin, user_registrationpost,user_registration,user_logout,user_forgotpassword,user_verify }