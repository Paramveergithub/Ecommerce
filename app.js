const express = require("express");
const { Connection } = require("mongoose");
const app = express();
const path = require('path');

const mongoose = require('mongoose');
const seedDB = require("./seed");
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const ProductApi = require('./routes/Api/productApi'); //Api
const passport = require("passport"); //pass
const LocalStrategy = require('passport-local'); //pass
const User = require('./models/User');  //pass
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();


let configSession = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
     httpOnly: true,
     expires : Date.now() + 7*24*60*60*1000,
     maxAge: 60*24*60*60*1000,
    }
};

mongoose.set("strictQuery", true);
let url = "mongodb+srv://Paramveer:ParamveerDB@cluster0.qcmyrrx.mongodb.net/DigiShop";

// mongoose.connect('mongodb://127.0.0.1:27017/julybatch')
mongoose.connect(url)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Error:", err);
  });


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
// seedDB();

app.use(session(configSession));
app.use(flash());

// use static serialize and deserialize of model for passport session support
app.use(passport.initialize());  //pass
app.use(passport.session());    //pass
passport.serializeUser(User.serializeUser()); //pass
passport.deserializeUser(User.deserializeUser());//pass

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));//pass

app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/', (req, res) => {
  res.render('home');
});

app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(ProductApi);

// let Port = 8080;
app.listen(process.env.PORT, ()=>{
  console.log(`Server is connected at : ${process.env.PORT}`);
})

// 1. Basic Server
// 2. Mongoose Connection
// 3. Model -> seed data
// 4. routes -> views
// 5. rating schema -> product change -> form to add the rating and comment (show.ejs)
// 