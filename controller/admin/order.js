const order=require('../../model/order')


const home=async(req,res)=>{
    try {
        res.locals.orders=await order.find().select('order user paymentamount paymentmethod status')
        res.render('admin/admin_order',{dark:4})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const cancel_order=async(req,res)=>{
    try {
        let a=await order.findOne({order:req.params.id}).select('status')
        a.status.order=false
        a.markModified('status.order');
        a.save()
        res.redirect('/admin/order')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}



module.exports={home,cancel_order}