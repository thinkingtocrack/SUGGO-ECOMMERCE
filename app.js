var express = require('express');
var path = require('path');
var logger = require('morgan');
const session=require('express-session')
const nocache=require('nocache')
const mongoose=require('mongoose')
require('dotenv').config();

// mongoose.connect('mongodb://127.0.0.1:27017/suggo')
mongoose.connect(process.env.mongourl)
    



var user = require('./routes/user');
var admin =require('./routes/admin')
var index=require('./routes/index')
const auth=require('./routes/auth')
const otp=require('./routes/otp')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret:'dfdsfdfdsfdsf',
  saveUninitialized:true,
  resave:false
}))

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(nocache())
app.use('/user', user);
app.use('/admin',admin)
app.use('/',index)
app.use('/auth',auth)
app.use('/otpverification',otp)




app.listen(4000,()=>{
  console.log('server sterted in port 4000')
})