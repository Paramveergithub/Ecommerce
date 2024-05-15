const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const User = require('../models/User');
const Product = require('../models/Product');

const stripe = require('stripe')('sk_test_51OsjffSFiPrrJSC17K5rqcTJ9HOc2cLBSjbMJj9yJFloziTnkjazZyfWn4v4ONyNr4AzsVfvzzsuE8cjClJ0QgOP00wBkIrOsr')


router.get('/user/cart', isLoggedIn, async (req, res)=>{
  let userId = req.user._id;
  let user = await User.findById(userId).populate('cart');
  let totalAmount = user.cart.reduce((sum, curr) => sum + parseFloat(curr.price), 0);
  res.render('cart/cart', {user, totalAmount});
})

router.get('/checkout/:id', async function(req, res) {
  let userId = req.params.id;
  let user = await User.findById(userId).populate('cart');
  let totalAmount = user.cart.reduce((sum, curr) => sum + parseFloat(curr.price), 0);

  let lineItems = [];
  user.cart.forEach(item => {
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: parseFloat(item.price) * 100,
      },
      quantity: 1,
    });
  });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:4242/success',
      cancel_url: 'http://localhost:4242/cancel',
    });
  
    res.redirect(303, session.url);
});

router.post('/user/:productId/add', isLoggedIn, async(req, res) => {
  let {productId} = req.params;
  let userId = req.user._id;
  let user = await User.findById(userId);
  let product = await Product.findById(productId);
  user.cart.push(product);
  await user.save();
  res.redirect('/user/cart');
})
module.exports = router;