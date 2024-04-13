const users=require('../model/users')



const cart=async(req,res,next)=>{
    if(req.session.user){
        const data = await users.findOne({ email: req.session.email }).select('cart name otp.status')
        if (!data?.otp.status) {
            res.locals.otpstatus=true
        }
        res.locals.cartnum=data.cart.length
        res.locals.auth=true
        res.locals.name=data.name
        res.locals.email = req.session.email
        res.locals.id=data.id
        next()
    }else{
        next()
    }
}


module.exports=cart