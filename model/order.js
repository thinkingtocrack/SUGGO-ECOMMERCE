const mongoose=require('mongoose')
const schema=mongoose.Schema


order=new schema({
    user:{type:String},
    order:{type:String},
    items:{type:Array},
    status:{type:Object},
    paymentamount:{type:Number},
    address:{type:Object},
    paymentmethod:{type:String},
    online:{type:Object},
    coupon:{type:Object},
    date:{type:Date,default:new Date()},
})

module.exports=mongoose.model('order',order)