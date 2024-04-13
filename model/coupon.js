const mongoose=require('mongoose')
const schema=mongoose.Schema


const coupon=new schema({
    coupon:{type:String,unique:true},
    status:{type:Boolean},
    discount:{type:Object},
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'coupon'
    }
})

module.exports=mongoose.model('coupon',coupon)