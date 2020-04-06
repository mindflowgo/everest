const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let users = new Schema ({
   name :  { type: String, trim: true },
   email :  { type: String, required: true, trim: true, match: [/.+@.+\..+/, 'Please enter a valid e-mail address'] },
   password :  { type: String, required: true, trim: true },
   // favourites: [{
   //    thumbId: mongoose.Types.ObjectId,
   //    favouriteTime: {type: Date, default: Date.now} }]
   cart: [{ id: mongoose.Types.ObjectId, num: Number, price: Number }]
}, {
   timestamps: true /* creates corresponding timestamp fields: createdAt, updatedAt */
});

module.exports = mongoose.model('users', users);