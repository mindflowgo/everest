const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId

mongoose.connect(process.env.MONGODB_URI,
   { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

// include mongoose models (it will include each file in the models directory)
const db = require('./models')

async function userRegister(userData) {
   if (!userData.name || !userData.email || !userData.password) {
      console.log('[registerUser] invalid userData! ', userData)
      return { status: false, message: 'Invalid user data' }
   }

   // refuse duplicate user emails
   let duplicateUser = await db.users.findOne({ email: userData.email })
   if (duplicateUser && duplicateUser._id) {
      return { status: false, message: 'Duplicate email, try another or login' }
   }

   // hash the password (salt=10)
   const passwordHash = await bcrypt.hash(userData.password, 10)

   const saveData = {
      name: userData.name,
      email: userData.email || '',
      thumbnail: userData.thumbnail || '',
      password: passwordHash
   }
   const saveUser = await db.users.create(saveData)
   if (!saveUser._id) {
      return { status: false, message: `Sorry failed creating entry for ${saveUser.name}: ` }
   }

   return {
      status: true,
      message: `Success! ${saveUser.name} was successfully registered`,
      userData: {
         id: saveUser._id,
         name: saveUser.name,
         email: saveUser.email,
      }
   }
}

async function userOAuthRegister({ type, authId, name, thumbnail }) {
   if (!authId) {
      console.log('[registerUser] invalid OAuth data! ', authId)
      return { status: false, message: 'Invalid user data' }
   }

   let oAuthUser = await db.users.findOne({ type, authId })
   console.log(`.. looking in userlist for type(${type}) and authId(${authId})`)
   if (!oAuthUser || !oAuthUser._id) {
      // new user so create!
      console.log('... SAVING oAuth user to database ')
      oAuthUser = await db.users.create({ type, authId, name, thumbnail })
      if (!oAuthUser._id) {
         return { status: false, message: `Sorry failed creating entry for ${name}: ` }
      }
   }
   // console.log( ' .. user: ' + JSON.stringify( oAuthUser ) )

   return {
      status: true,
      message: `Success! ${name} was successfully logged-in`,
      userData: {
         id: oAuthUser._id,
         name: oAuthUser.name,
         email: '',
         thumbnail: oAuthUser.thumbnail,
         type: oAuthUser.type
      }
   }
}

async function userLogin(email, password) {
   const userData = await db.users.findOne({ email: email }, '-createdAt -updatedAt')
   if (!userData || !userData._id) {
      return { status: false, message: 'Invalid login' }
   }

   // compare the passwords to see if valid login
   const isValidPassword = await bcrypt.compare(password, userData.password)
   // console.log( ` [loginUser] checking password (password: ${password} ) hash(${userData.password})`, isValidPassword )
   if (!isValidPassword) {
      return { status: false, message: 'Invalid password' }
   }

   return {
      status: true,
      message: `Logging in ${userData.name}...`,
      userData: {
         id: userData._id,
         name: userData.name,
         email: userData.email,
         thumbnail: userData.thumbnail,
         type: 'local'
      }
   }
}
async function createBuyer(id, buyerInfo) {
   
   const userData = await db.buyers.create({ ...buyerInfo, user: mongoose.Types.ObjectId(`${id}`) })
   const updateUser = await db.users.updateOne({"_id": ObjectId(id)}, {$set: {buyer: ObjectId(userData._id)}})
   return {
      status: true,
      message: `inserting in ${userData.insertedId}...`,
      userData: {
         id: userData._id,
      }
   }
}
async function userSession(userId) {
   const userData = await db.users.findOne({ _id: userId })
   if (!userData || !userData._id) {
      return { status: false, message: 'Invalid session' }
   }
   return {
      status: true,
      message: '',
      userData: {
         id: userData._id,
         name: userData.name,
         email: userData.email,
         thumbnail: userData.thumbnail
      }
   }
}

async function productList(productId = '', ownerId = '', message = '') {
   const findSet = {}
   if (productId && productId.length > 10) {
      findSet._id = productId
   }
   if (ownerId) {
      findSet.ownerId = ownerId
   }
   let products = await db.products.find(findSet, '-__v')
   // map a 'id' field to be consistent with mysql
   console.log(`[orm:productList] products(${products.length}) findSet:`, findSet)
   return {
      status: true,
      message,
      products
   }
}

async function productSaveAndList(newProduct, ownerId) {
   // refuse duplicate user emails
   const result = await db.products.create({ ...newProduct, ownerId })
   if (!result._id) {
      return {
         status: false,
         message: 'Sorry could not save task!'
      }
   }

   return productList('', ownerId, 'Product saved')
}

async function seedDatabase() {
   const productsExist = await db.products.findOne({})
   if (productsExist && productsExist._id) {
      console.log(' .. not seeding, found a product already.')
      return
   }

   const fs = require('fs')
   const products = JSON.parse(fs.readFileSync('./app/db/seed.json'))
   products.forEach(async productData => {
      const result = await db.products.create(productData)
      if (!result._id) {
         console.log(' .. problems seeding entry: ', productData)
      } else {
         console.log(`.. seeded: ${productData.heading}`)
      }
   })
}

module.exports = {
   userRegister,
   userLogin,
   userOAuthRegister,
   userSession,
   productList,
   productSaveAndList,
   seedDatabase,
   createBuyer
}