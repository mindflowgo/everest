const mongoose = require('mongoose')
const Schema = mongoose.Schema

const buyers = new Schema(
    {
        
        priceMin: {
            type: Number,
            trim: true,
        },
        priceMax: {
            type: Number,
            trim: true,
        },
        size: {
            type: Map,
            of: Boolean
        },
        agePref: {
            type: Array
        },
        user: {
            type: Schema.Types.ObjectId,  
        },
    }
);

module.exports = mongoose.model('buyers', buyers)