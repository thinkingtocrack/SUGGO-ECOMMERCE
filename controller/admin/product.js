const products = require('../../model/product')
const categorys = require('../../model/category')
const category = require('../../model/category')
const product = require('../../model/product')
const crypto = require("crypto");




const product_home = async (req, res) => {
    try {
        const data = await categorys.find().select('category')
        const items = await products.find()
        res.render('./admin/admin_product', { data: items ,dark:1,category:data})
    } catch (error) {
        res.send(error)
    }
}


const product_edit=async(req,res)=>{
    try {
        const data = await products.findById(req.params.id).select('productname category brand description varient productId')
        res.json({
            data:data,
        })
    } catch (error) {
        res.send(error)
    }
}

const product_status=async (req, res) => {
    const { statusid, status } = req.body
    try {
        const product = await products.findById(statusid).select('_id status')
        if (status) {
            product.status = status
            await product.save()
            res.json({
                productid:statusid,
                done:true,
            })
        }
    } 
    catch (error) {
        res.json({
            productid:statusid,
            done:false,
        })
    }
}

const product_new_post=async(req,res)=>{
    try {
        do{
            var productId = crypto.randomInt(1000000,10000000);
            var vid=crypto.randomInt(100,999);
            let z=await product.find({productId:productId})
            if(z.length==0){
                break;
            }
        }while(true)
        let arrayimage = req.files.map((a) => {
            return a.filename
        })
        let data = {
            varient:[{
                id:vid,
                price:Number(req.body.price),
                stock:req.body.stock,
                image:arrayimage,
                color:req.body.color,
                productdetails:req.body.productdetails.split(','),
                review:[],
                status:Boolean(Number(req.params.id)),
            }],
            status:Boolean(Number(req.params.id)),
            productname:req.body.productname,
            productId:productId,
            description:req.body.description,
            brand:req.body.brand,
            category:req.body.category,
        }
        await products.create(data)
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const product_new_varient=async(req,res)=>{
    try {
        do{
            var vid = crypto.randomInt(100,999);
            let z=await product.find({productId:req.params.id,varient: {$elemMatch: {id: vid}}})
            if(z.length==0){
                break;
            }
        }while(true)
        let arrayimage = req.files.map((a) => {
            return a.filename
        })
        let data = {
                id:vid,
                price:Number(req.body.price),
                stock:req.body.stock,
                image:arrayimage,
                color:req.body.color,
                productdetails:req.body.productdetails.split(','),
                review:[],
                status:Boolean(Number(req.params.status)),
            }
        await product.findByIdAndUpdate(req.params.id,{ $push: { varient: data } },{ new: true })
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const product_edit_post=async(req,res)=>{
    const product = await products.findById(req.params.id)
    const data=req.body
    try {
        await products.findByIdAndUpdate(req.params.id,
            {
                productname: data?.productname == undefined ? product.productname : data.productname,
                category: data?.category == undefined ? product.category : data.category,
                brand: data?.brand == undefined ? product.brand : data.brand,
                description: data?.description == undefined ? product.description : data.description,
            }, { new: true, runValidators: true }
        )
        res.redirect('/admin/product')
    } catch (error) {
        res.redirect('/admin/product')
    }
}

const product_editvarient=async(req,res)=>{
    try {
        const {id}=req.params
        const status=Boolean(req.body?.status)
        const {vid,color,price,stock,productdetails}=req.body
        let arrayimage = req.files.map((a) => {
            return a.filename
        })
        const updateObject = {
            ...(color !== undefined && { "varient.$.color": color }),
            ...(price !== undefined && { "varient.$.price": Number(price) }),
            ...(stock !== undefined && { "varient.$.stock": stock }),
            ...(productdetails !== undefined && { "varient.$.productdetails": productdetails.split(',') }),
            ...(arrayimage.length!==0 && {'varient.$.image':arrayimage}),
            ...{'varient.$.status':status}
        };
        await products.findOneAndUpdate({productId:id,'varient.id':Number(vid)},{$set:updateObject},{ new: true })
        res.redirect('/admin/product')
    } catch (error) {
        
    }
}

const product_delete=async(req,res)=>{
    try {
        await products.findByIdAndDelete(req.params.id)
        res.json({
            product:req.params.id,
            deleted:true,
        })
    } catch (error) {
        res.json({
            product:req.params.id,
            deleted:false,
        })
    }
}

const varient_delete=async(req,res)=>{
    try {
        let a=await products.updateOne({ productId:req.params.productid }, { $pull: { varient: {id:Number(req.params.vid)}} })
        res.redirect('/admin/product')
    } catch (error) {
        res.send(error)
    }
}

module.exports = { varient_delete,product_editvarient,product_new_varient,product_home ,product_edit,product_status,product_new_post,product_edit_post,product_delete}