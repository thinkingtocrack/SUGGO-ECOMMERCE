const coupon=require('../../model/coupon')


const home=async(req,res)=>{
    try {
        if(req.session?.couponerror){
            res.locals.couponerror=req.session.couponerror
            delete req.session.couponerror
        }
        res.locals.coupons=await coupon.find()
        res.render('admin/admin_coupon',{dark:6})
    } catch (error) {
        
    }
}

const new_coupon=async(req,res)=>{
    try {
        data={
            status:Boolean(Number(req.params.id)),
            coupon:req.body.coupon,
            discount:Number(req.body.discount)
        }
        await coupon.create(data)
        res.redirect('/admin/coupon')
    } catch (error) {
        if(error.code==11000){
            req.session.couponerror='Coupon is Already added'
        }
        res.redirect('/admin/coupon')
    }
}

const deletecoupon=async(req,res)=>{
    try {
        await coupon.findByIdAndDelete(req.params.id)
        res.json({
            deleted:true
        })
    } catch (error) {
        console.log(error)
        res.json({
            deleted:false
        })
    }
}

const status=async(req,res)=>{
    const {statusid,status} = req.body
    try {
        const data = await coupon.findById(statusid)
        data.status = status
        data.save()
        res.json({
            statusid:statusid,
            done:true,
        })
    } catch (error) {
        console.log(error)
        res.json({
            status:statusid,
            done:false,
        })
    }
}

const editcoupon=async(req,res)=>{
    try {
        const data=await coupon.findById(req.params.id).select('coupon discount')
        res.json({
            data:data
        })
    } catch (error) {
        console.log(error)
        res.redirect('/admin/category')
    }
}


const couponeditpost = async (req, res) => {
    try {
        const {id,status}=req.params
        const data=req.body
        const coupons = await coupon.findById(id)
        await coupon.findByIdAndUpdate(id,
            {
                coupon: data?.coupon == undefined ? coupons.coupon : data.coupon,
                discount:data?.discount == undefined ? coupons.discount : data.discount,
                status: Boolean(Number(status)),
            }, { new: true, runValidators: true }
        )
        res.redirect('/admin/coupon')
    } catch (error) {
        if(error.code==11000){
            req.session.couponerror='Cannot be changed to an Existing Coupon'
        }
        res.redirect('/admin/coupon')
    }
}  


module.exports={couponeditpost,editcoupon,status,deletecoupon,home,new_coupon}