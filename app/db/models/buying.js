const mongoose = require('mongoose')
const Schema = mongoose.Schema

const buyer = new Schema(
    {
        buyerName: {
            type: String,
            trim: true,
            required: "Enter your name"
        },
        priceRange: {
            type: Number,
            trim: true,
        },
        size: {
            type: String
        }

    }
);

module.exports = mongoose.model('buyer', buyer)