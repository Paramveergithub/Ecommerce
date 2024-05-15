const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateProduct, isLoggedIn, isSeller, isProductAuthor } = require('../middleware');
const router = express.Router(); // mini application

// displaying all the products
router.get('/products', async (req, res)=>{
  try{
    let products = await Product.find({});
  res.render('products/index', {products})
  }
  catch(e){
    res.render('error', {err : e.message})
  }
});

// Adding a form for a new product
router.get('/products/new', isLoggedIn, isSeller, (req, res)=>{
  try{
    res.render('products/new');
  }
  catch(e){
    res.render('error', {err : e.message})
  }
})


// Actually adding a product in a DB
router.post('/products', isLoggedIn, isSeller, validateProduct, async(req, res)=>{
  try{
    let {name, img, price, desc} = req.body;
    await Product.create({name, img, price, desc, author: req.user._id});
    req.flash('success', 'Product added successfully')
    res.redirect('/products');
  }
  catch(e){
    res.render('error', {err : e.message});
  }
})

// Show particular product
router.get('/products/:id', isLoggedIn, async(req, res)=>{
  try{
    let {id} = req.params;
    let productFound = await Product.findById(id).populate('reviews');
    // console.log(productFound)
    res.render('products/show', {productFound, msgs:req.flash('msg')});  
  }
  catch(e){
    res.render('error', {err : e.message})
  }
})


// Show edit form so that we could edit the product details
router.get('/products/:id/edit', isLoggedIn, isSeller, isProductAuthor, async(req, res)=>{
  try{
    let {id} = req.params;
    let productFound = await Product.findById(id);
    res.render('products/edit', {productFound})
  }
  catch(e){
    res.render('error', {err : e.message});
  }
})


// actully update the product in the database
router.patch('/products/:id', isLoggedIn, isSeller, validateProduct, async(req, res)=>{
  try{
    let {id} = req.params;
    let {name, img, price, desc} = req.body;
    await Product.findByIdAndUpdate(id, {name, img, price, desc});
    req.flash('success', 'Product edited successfully')
    res.redirect('/products')  
  }
  catch(e){
    res.render('error', {err : e.message})
  }
})

// Delete Product
router.delete('/products/:id', isLoggedIn, isSeller, isProductAuthor, async (req, res)=>{
  try{
    let {id} = req.params;
    let productFound = await Product.findById(id);
    // deleting reviews before deleting product
    for(let ids of productFound.reviews){
      await Review.findByIdAndDelete(ids);
    }
  
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Product deleted successfully')
    res.redirect('/products')
  }
  catch(e){
    res.render('error', {err : e.message});
  }
})

module.exports = router;

