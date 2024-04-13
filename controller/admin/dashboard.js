const category = require('../../model/category')
const ordermodal=require('../../model/order')
const product = require('../../model/product')
const excel_download=require('../../utils/admin_utils')

const dashboard_home = async(req, res) => {
    let orders=await ordermodal.find()
    res.locals.totalorder=orders.length
    res.locals.totalamount=await ordermodal.aggregate([
        {
          $group: {
            _id: null, 
            total: { $sum: "$paymentamount" }
          }
        }
      ])
    res.locals.totaldiscount=await ordermodal.aggregate([
        {
          $group: {
            _id: null, 
            total: { $sum: "$coupon.discount" }
          }
        }
      ])
    res.render('admin/admin_dashboard',{dark:0})
}

const dashboard_topitems=async(req,res)=>{
  const topcategory=await ordermodal.aggregate([
    {
      $unwind: "$items"
    },
    {
      $group: {
        _id: {
          category: "$items.category",
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.category": 1
      }
    },
    {
      $limit:10
    }
  ])
  const topproduct=await ordermodal.aggregate([
    {
      $unwind: "$items"
    },
    {
      $group: {
        _id: {
          product: "$items.productname",
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.product": 1
      }
    },
    {
      $limit:10
    }
  ])
  const topbrand=await ordermodal.aggregate([
    {
      $unwind: "$items"
    },
    {
      $group: {
        _id: {
          brand: "$items.brand",
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.brand": 1
      }
    },
    {
      $limit:10
    }
  ])
  res.json({brand:topbrand,category:topcategory,product:topproduct})
}

const dashboard_graph=async (req,res)=>{
  let timeframe=Number(req.query.timeframe)
  let prop
  switch(timeframe) {
    case 1:
      prop={$dayOfMonth:'$date'}
      // Code to be executed if expression === value1
      break;
    case 3:
      prop={$year:'$date'}
      break;
    // More cases can be added as needed
    case 3:
      prop={$month:'$date'}
      break;
    default:
      prop={$month:'$date'}
      // Code to be executed if none of the above cases are true
  }
  let data=await ordermodal.aggregate([
    {
      $group: {
        _id:prop, // Group by the month number
        count: { $sum: 1 } // Count the number of documents for each month
      }
    },
    {
      $sort: {
        _id: 1 // Sort by the month number in ascending order
      }
    }
  ]);
  res.json({data:data})
}

const dashboard_reportdownload=async(req,res)=>{
  let timeframe=req.body.timeframe
  let currentDate=new Date(req.body.to)
  currentDate.setHours(23);
  currentDate.setMinutes(59);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  let prop
  switch(timeframe) {
    case 'day':
      prop={$dayOfMonth:'$date'}
      // Code to be executed if expression === value1
      break;
    case 'month':
      prop={$month:'$date'}
      break;
    // More cases can be added as needed
    case 'week':
      prop={$week:'$date'}
      break;
    default:
      prop={$dayOfMonth:'$date'}
      // Code to be executed if none of the above cases are true
  }
  let data=await ordermodal.aggregate([
    {
      $match:{
        date:{
          $gte: new Date(req.body.from),
          $lte: currentDate
        }
      }
    },
    {
      $group: {
        _id:prop, // Group by the month number
        count: { $sum: 1 }, // Count the number of documents for each month
      }
    },
  ]);
  const totalamount=await ordermodal.aggregate([
    {
      $group: {
        _id: null, 
        total: { $sum: "$paymentamount" }
      }
    }
  ])
const discount=await ordermodal.aggregate([
    {
      $group: {
        _id: null, 
        total: { $sum: "$coupon.discount" }
      }
    }
  ])
  await excel_download.create_excel_report(res,data,timeframe,totalamount,discount)
}

module.exports={dashboard_topitems,dashboard_reportdownload,dashboard_home,dashboard_graph}