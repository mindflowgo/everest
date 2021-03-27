const mongoose = require('mongoose')
const Schema = mongoose.Schema

let users = new Schema ({
   name:  { type: String, required: true, trim: true },
   email:  { type: String, trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid e-mail address'] },
   thumbnail: { type: String, trim: true },
   type: { type: String, default: 'local' }, // used by OAuth
   authId: { type: String, default: '' }, // used by OAuth
   password:  { type: String, trim: true },
   // favourites: [{
   //    thumbId: mongoose.Types.ObjectId,
   //    favouriteTime: {type: Date, default: Date.now} }]
   cart: [{ id: Schema.Types.ObjectId, num: Number, price: Number }]

}, {
   timestamps: true /* creates corresponding timestamp fields: createdAt, updatedAt */
})

module.exports = mongoose.model('users', users)