const mongoose = require("mongoose");

// Schema
const reviewSchema = new mongoose.Schema({
   rating:{
    type:Number,
    min:0,
    max:5
   },
   comment:{
    type:String,
    trim:true
   }
}, {timestamps:true})

// Model / collection -> JS class -> objects / document
// Model -> singular & capital letter
let Review = mongoose.model('Review', reviewSchema);

module.exports = Review;










