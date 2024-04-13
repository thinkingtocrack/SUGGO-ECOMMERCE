const mongoose=require('mongoose')
const schema=mongoose.Schema


const category=new schema({
    category:{type:String,unique:true},
    status:{type:Boolean}
})

module.exports=mongoose.model('category',category)