const sharp = require('sharp');


const corpimage=async(req,res,next)=>{
    req.files.forEach(element => {
        sharp('input.jpg').resize(200)
    });
}