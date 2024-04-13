const mongoose=require('mongoose')
const Schema=mongoose.Schema

const product=new Schema({
    productname:{type:String},
    brand:{type:String},
    category:{type:String},
    varient:{type:Array},
    status:{type:Boolean},
    description:{type:String},
    productId: { type: String}
})

module.exports=mongoose.model('product',product)