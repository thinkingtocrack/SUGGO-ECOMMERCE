const users=require('../../model/users')


const customer_home = async (req, res) => {
    const user=await users.find().select('_id name phone email address status')
    res.render('admin/admin_customers',{data:user,dark:2})
}
const customer_status=async(req,res)=>{
    try {
        const { customerid, status } = req.body
        const user = await users.findById(customerid).select('_id status')
        user.status = status
        user.save()
        res.json({
            cusid:customerid,
            done:true,
        })
    } catch (error) {
        console.log(error)
    }  
}

const customer_delete=async(req,res)=>{
    try {
        await users.findByIdAndDelete(req.params.id)
        res.json({
            deleteduser:true
        })
    } catch (error) {
        console.log(error)
        res.json({
            deleteuser:false
        })
    }
}

module.exports={customer_home,customer_status,customer_delete}