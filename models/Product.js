const mongoose = require("mongoose");
const Review = require("./Review");
// Schema
const productSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true
  },
  img:{
    type:String,
    trim:true
  },
  price:{
    type:String,
    min:0,
    required:true
  },
  desc:{
    type:String,
    trim:true
  },
  reviews: [
   {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
   }
  ],
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

productSchema.post('findOneAndDelete', async function (product){
  if(product.reviews.length > 0){
    await Review.deleteMany({_id:{$in:product.reviews}})
  }
})

// Model / collection -> JS class -> objects / document
// Model -> singular & capital letter
let Product = mongoose.model('Product' , productSchema);

module.exports = Product;