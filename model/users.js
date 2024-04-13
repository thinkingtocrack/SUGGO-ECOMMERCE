const mongoose=require('mongoose')
const Schema=mongoose.Schema


const usersSchema=new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    name:{type:String},
    email:{type:String},
    phone:{type:String},
    password:{type:String},
    address:{type:Array},
    cart: { type: Array },
    wishlist:{type: Array},
    status:{type:Boolean,default:true},
    otp: {
        otpcode: { type: String },
        status: { type: Boolean,default:false},
        createdAt: { type: Date,default:null }
    },
    wallet:{type:Number,default:0}
})

module.exports=mongoose.model('user',usersSchema)