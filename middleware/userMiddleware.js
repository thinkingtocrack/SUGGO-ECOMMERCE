const users=require('../model/users')

const seq = async(req, res, next) => {
    const status=await users.findOne({email:req.session.email}).select('status')
    if (req.session.user && status.status) {
        next()
    } else {
        delete req.session.user
        delete req.session.email
        res.redirect('/')
    }
}

const shopseq=async(req, res, next) => {
    const status=await users.findOne({email:req.session.email}).select('status')
    if (req.session.user && status.status) {
        next()
    } else {
        delete req.session.user
        delete req.session.email
        next()
    }
}

const otpseq=async(req,res,next)=>{
    const status=await users.findOne({email:req.session.email}).select('status')
    if (req.session.user && status.status) {
        next()
    } else {
        delete req.session.user
        delete req.session.email
        res.redirect('/')
    }
}

const forgetpasswordseq=(req,res,next)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        next()
    }
}

const user_accountseq=(req,res,next)=>{
    if(!req.session.user){
        res.redirect('/user/user_signin')
    }else{
        next()
    }
}

module.exports={user_accountseq,seq,shopseq,otpseq,forgetpasswordseq}