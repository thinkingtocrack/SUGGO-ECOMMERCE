const categorys=require('../../model/category')


const home = async(req, res) => {
    try {
        if(req.session?.categoryerror){
            res.locals.categoryerror=req.session.categoryerror
            delete req.session.categoryerror
        }
        res.locals.data = await categorys.find()
        res.render('admin/admin_category',{dark:3})
    } catch (error) {
        res.send(error)
    }
}

const statusupdate=async(req,res)=>{
    const {statusid,status} = req.body
    try {
        const data = await categorys.findById(statusid)
        data.status = status
        data.save()
        res.json({
            categoryid:statusid,
            done:true,
        })
    } catch (error) {
        console.log(error)
        res.json({
            categoryid:statusid,
            done:false,
        })
    }
}

const deletecategory=async(req,res)=>{
    try {
        await categorys.findByIdAndDelete(req.params.id)
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


const newcategorypost=async(req,res)=>{
    try {
        const data=req.body
        req.params.id==1?data.status=true:data.status=false
        await categorys.create(data)
        res.redirect('/admin/category')
    } catch (error) {
        if(error.code==11000){
            req.session.categoryerror='Category is Already added'
        }
        res.redirect('/admin/category')
    }
}

const editcategory=async(req,res)=>{
    try {
        const data=await categorys.findById(req.params.id).select('category')
        res.json({
            data:data
        })
    } catch (error) {
        res.redirect('/admin/coupon')
    }
}

const categoryeditpost = async (req, res) => {
    try {
        const {id,status}=req.params
        const data=req.body
        const category = await categorys.findById(id)
        await categorys.findByIdAndUpdate(id,
            {
                category: data?.category == undefined ? category.category : data.category,
                status: Boolean(Number(status)),
            }, { new: true, runValidators: true }
        )
        res.redirect('/admin/category')
    } catch (error) {
        if(error.code==11000){
            req.session.categoryerror='Cannot be changed to an Existing Category'
        }
        res.redirect('/admin/category')
    }
}  


module.exports = { home, statusupdate, deletecategory, newcategorypost, editcategory,categoryeditpost }