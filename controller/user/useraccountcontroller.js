const user = require('../../model/users')
const bcrypt = require('bcrypt')
const otpFunction=require('../../controller/otp/otpcontroller')
const {validationResult}=require('../../middleware/validation')
const product = require('../../model/product')
const order=require('../../model/order')
const mongoose=require('mongoose')
const crypto=require('crypto')
const { match } = require('assert')
const {createpdf}=require('../../utils/user/pdf_invoice')


const user_dashboard= async (req,res)=>{
    try {
        let userx=await user.findOne({email:req.session.email}).select('wallet')
        res.locals.wallet=userx.wallet
        res.locals.dark=0
        res.locals.link='dashboard.ejs'
        res.render('./userhome/user_home')
    } catch (error) {
        res.send(error)
    }
}


const user_order=async (req,res)=>{
    try {
        res.locals.orders=await order.aggregate([{$match:{user:req.session.email}}])
        res.locals.dark=1
        res.locals.link='order.ejs'
        res.render('./userhome/user_home')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const order_details=async (req,res)=>{
    try {
        let order_info=await order.findOne({order:req.params.id})
        res.locals.dark=1
        res.locals.info=order_info
        res.locals.link='orderdetails.ejs'
        res.render('./userhome/user_home')

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const user_ordercancel=async(req,res)=>{
    try {
        let wallet=await user.findOne({email:req.session.email}).select('wallet')
        let orderx = await order.findByIdAndUpdate(req.params.id,{'status.order':false},{new:true})
        walletamount=wallet.wallet+orderx.paymentamount
        await user.findOneAndUpdate({email:req.session.email},{wallet:walletamount})
        res.json({order_cancelled:!orderx.status.order})
    } catch (error) {
        console.log(error)
        res.json({error})
    }
}

const user_orderreturn=async(req,res)=>{
    try {
        const returnobj={
            done:true,
            reason:req.body.reason
        }
        let wallet=await user.findOne({email:req.session.email}).select('wallet')
        let orderx=await order.findOneAndUpdate({order:req.params.id},{'status.return':returnobj},{new:true})
        walletamount=wallet.wallet+orderx.paymentamount
        await user.findOneAndUpdate({email:req.session.email},{wallet:walletamount})
        if(orderx.status.return.done){
            res.redirect('/user/account/order/'+req.params.id)
        }
    } catch (error) {
        
    }
}

const order_invoice=async (req,res)=>{
    const userx=await order.findOne({order:req.params.id})
    let pdf=await createpdf(userx)
    const fs=require('fs')
    await fs.writeFileSync('./public/invoice/invoice.pdf',pdf.pdf,'base64')
    res.download('./public/invoice/invoice.pdf')
}




const user_address = async(req, res) => {
    try {
        let address=await user.aggregate([{$match:{email:req.session.email}},{$unwind:'$address'},{$project:{address:1}}])
        res.locals.address=address
        res.locals.dark=2
        res.locals.link='address.ejs'
        res.render('./userhome/user_home')
    } catch (error) {
        res.send(error)
    }
}

const user_addnewaddress=async (req,res)=>{
    try {
        do{
            var id = crypto.randomInt(10,99);
            let z=await user.find({email:req.session.email,address: {$elemMatch: {id: id}}})
            if(z.length==0){
                break;
            }
        }while(true)
        let data={
            id:id,
            fullname:`${req.body.firstname} ${req.body.lastname}`,
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            zip:req.body.zip
        }
        await user.updateOne({email:req.session.email}, { $push: { address: data } })
        res.redirect('/user/account/address')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const user_deleteaddress=async(req,res)=>{
    try {
        await user.findOneAndUpdate({email:req.session.email},{ $pull: { address: {id:Number(req.params.id)} } })
        res.redirect('/user/account/address')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const user_editaddress=async(req,res)=>{
    try {
        updateObject={
            'address.$.id':Number(req.params.id),
            'address.$.fullname':req.body.firstname+' '+req.body.lastname,
            'address.$.address':req.body.address,
            'address.$.city':req.body.city,
            'address.$.state':req.body.state,
            'address.$.zip':req.body.zip
        }
        await user.findOneAndUpdate({email:req.session.email,'address.id':Number(req.params.id)},{$set:updateObject},{ new: true })
        res.redirect('/user/account/address')
    } catch (error) {
        
    }
}

const address_details=async(req,res)=>{
    try {
        let data=await user.findOne({email:req.session.email})
        let addressdata=data.address.filter(e=>e.id==req.params.id)
        res.json({data:addressdata})
    } catch (error) {
        
    }
}


const user_accountdetails=async(req,res)=>{
    try {
        res.locals.dark=3
        res.locals.link='user.ejs'
        res.render('./userhome/user_home')
    } catch (error) {
        
    }
}



module.exports={order_invoice,user_accountdetails,user_dashboard,user_orderreturn,user_ordercancel,address_details,user_editaddress,order_details,user_order,user_address,user_addnewaddress,user_deleteaddress}