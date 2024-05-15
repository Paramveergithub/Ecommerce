const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateReview, isLoggedIn } = require('../middleware');
const router = express.Router(); // mini application

// review route
router.post('/products/:id/rating', isLoggedIn, validateReview, async (req, res)=>{
   try{
      let {id} = req.params;
      let {rating, comment} = req.body;

   let product = await Product.findById(id);
   //new review
   let review = new Review ({rating, comment});

   product.reviews.push(review);

   await product.save();
   await review.save();

   // adding flash messages
   req.flash('success', "Review Added Successfull");
   res.redirect(`/products/${id}`);
   }
   catch(e){
      res.render('error', {err: e.message});
   }
})

module.exports = router;
