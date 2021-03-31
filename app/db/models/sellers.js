const mongoose = require('mongoose')
const Schema = mongoose.Schema

const seller = new Schema(
   {
      user: {
         type: Schema.Types.ObjectId,  
     },
      dogName: {
         type: String,
         trim: true,
         required: "Enter the dog's name"
      },
      image: {
         type: String,
         trim: true,
         required: "Please provide an image of the dog"
      },
      age: {
         type: Number,
         trim: true,
         required: "Please enter the age of the dog"
      },
      size: {
         type: String,
         required: "Please enter the size of the dog"
      },
      breed: {
         type: String,
         trim: true,
         required: "Please enter a breed"
      },
      price: {
         type: Number,
         trim: true,
         required: "What is the price of the dog"
      },
      website: {
         type: String,
         trim: true
      },
      description: {
         type: String,
         required: "Please provide information about the dog"
      }
   }
);

module.exports = mongoose.model('sellers', seller)


