const product = require('../model/product')
const category =require('../model/category')

const homepage = async (req, res) => {
    try {
        res.render('./user/index.ejs')    
    } catch (error) {
        res.send(error)
    }
    
}

const shop = async (req, res) => {
    try {
        const truecategory = await category.find({ status: true }).select('category');
        let color = await product.aggregate([{$unwind:'$varient'},{$project:{'varient.color':1}}])
        color=color.map(e=>e.varient.color)
        color=new Set(color)
        let colorarray = [];
        if (req.query?.color) {
            colorarray = req.query.color.split(',');
        }
        let categoryarray = [];
        if (req.query?.category) {
            categoryarray = req.query.category.split(',');
        }
        let query = {status:true};
        if (req.query?.search) {
            query.productname = { $regex: new RegExp(req.query.search, 'i') };
        }
        if (categoryarray.length > 0) {
            query.category = { $in: categoryarray };
        }
        if(req.query?.minprice || req.query?.maxprice){
            query['varient.price']={
                $gte:req.query?.minprice ? Number(req.query.minprice):0,
                $lte:req.query?.maxprice ? Number(req.query.maxprice):100000
            } 
        }
        if (colorarray.length > 0){
            query['varient.color']={$in:colorarray}
        }
        let products = await product.aggregate([{$unwind:'$varient'},{$match:query},{$match:{'varient.status':true}}])
        res.locals.filter=categoryarray
        res.locals.colorfilter=colorarray
        res.locals.category=truecategory
        res.locals.products = products
        res.locals.color=color
        res.locals.price={
            min:req.query?.minprice ? Number(req.query.minprice):0,
            max:req.query?.maxprice ? Number(req.query.maxprice):100000
        }
        res.render('./user/shop.ejs')
    } catch (error) {
        console.log(error)
        res.send(error)
    } 
}

const productpage = async (req, res) => {
    try {
        const id = req.params.id
        const item = await product.aggregate([{$match:{productId:id}},{$unwind:'$varient'},{ $match: { 'varient.id': Number(req.params.v) } }])
        const rate = await product.aggregate([
            { $match: { productId: id } },
            { $unwind: '$varient' },
            { $match: { 'varient.id': Number(req.params.v) } },
            {$unwind:'$varient.review'},
            {
              $group: {
                _id: '$varient.id',
                avgRate: { $avg: '$varient.review.rate' }
              }
            }
          ]);
        const similar=await product.aggregate([{$match:{category:item[0].category}},{$unwind:'$varient'},{$limit:5}])
        const varient =await product.aggregate([{$match:{productId:id}},{$unwind:'$varient'},{$project:{_id:0,'varient.id':1,'varient.color':1}}])
        res.locals.similar=similar
        res.locals.varient=varient
        res.locals.totalrate=rate
        res.render('./user/view', { item: item})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports={homepage,shop,productpage}