const user = require('../../model/users')


const otp=()=>{
    return String(Math.floor(Math.random()*9000+1000))
}


const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});


sendMail = async (params) => {
    try {
        let info = await transporter.sendMail({
            // from: process.env.NODEMAILER_EMAIL,
            from: 'shaine20000@gmail.com',
            to: params.to,
            subject: 'Hello ✔',
            html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to the club.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
   </div>
    `,
        });
        console.log(info)
        return info;
    } catch (error) {
        console.log(error);
        return false;
    }
};


const send_otp=async(req,res)=>{
    try {
        const data=await user.findById(req.params.id).select('email otp')
        if(data.otp.createdAt==null){
            const otpData = {
                to: data.email,
                OTP: otp()
            }
            data.otp.otpcode = otpData.OTP
            data.otp.createdAt=new Date()
            try {
                await sendMail(otpData)
            } catch (error) {

            }
            await data.save()
            res.json({
                otpsend: 'ok',
                wait:59
            })
        }else if((new Date().getTime()-data.otp.createdAt.getTime())/1000>=60){
            const otpData = {
                to: data.email,
                OTP: otp()
            }
            data.otp.otpcode = otpData.OTP
            data.otp.createdAt = new Date()
            try {
                await sendMail(otpData)
            } catch (error) {

            }
            await data.save()
            res.json({
                otpsend: 'ok',
                wait:60- ((new Date().getTime() - data.otp.createdAt.getTime())/1000)
            })
        }else{
            res.json({
                otpsend:'ok',
                wait: 60-(new Date().getTime()-data.otp.createdAt.getTime())/1000
            })
        }
    } catch (error) {
        res.send(error)
    }
}

renderotp=async(req,res)=>{
    try {
        const response = await fetch(`https://suggo.shop/otpverification/sendotp/${req.params.id}`,{method: 'GET',credentials: 'include',})
        const otpres = await response.json()
        res.render('./common/otpverify', { otpaddress: '/', otpwait: Math.floor(otpres.wait), id: req.params.id })       
    } catch (error) {
        res.send(error)
    }
}

module.exports={sendMail,otp,send_otp,renderotp}

