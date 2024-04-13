const {body,validationResult}=require('express-validator')


const userRegistration=[
    body('name').isString().isLength({min:3,max:30}).exists(),
    body('email').isEmail().exists(),
    body('phone').exists().isMobilePhone(),
    body('password').exists().isLength({min:6}),
]



module.exports={userRegistration,validationResult}