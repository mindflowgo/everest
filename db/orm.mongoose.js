const mongoose = require('mongoose');
const bcrypt = require ( 'bcrypt' );

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// include mongoose models (it will include each file in the models directory)
const db = require( './models' );

// input : userId, tag*
// output: <array> [{thumbId, name, imageUrl, tags, creationTime, isFavourite }]
async function listThumbnails( userId, tag='' ){
   // if a tag is given do a find-where 'tag' in tags
   const thumbList = tag==='' ? await db.thumbnail.find()
      : await db.thumbnail.find().$where(`this.tags.indexOf('${tag}') > -1`);

   // now get the corresponding user likes
   let userFavouriteList = await db.users.findOne({ _id: userId }, 'favourites' );
   userFavouriteList = userFavouriteList.favourites;

   // now clean up the list and return relevant data in camelCase
   let myList = [];
   thumbList.forEach( function( item ){
      myList.push({
         thumbId: item._id,
         name: item.name,
         imageUrl: item.imageUrl,
         tags: item.tags,
         creationTime: item.createdAt,
         // GOTCHA: 'fav' and item._id are typeof: objects ... pointing to different things so must cast to string
         isFavourite: !userFavouriteList ? false :
            userFavouriteList.filter( fav=>String(fav)===String(item._id) ).length>0 ? true : false
      });
   });
   return myList;
}

// input: <object> { name, imageUrl, tags }
// output: thumbId on success, false otherwise
async function saveThumbnail( myData ){
   const thumbnailData = {
      name: myData.name,
      imageUrl: myData.imageUrl,
      tags: myData.tags
   };
   const dbResult = await ( new db.thumbnail(thumbnailData) ).save();
   return dbResult._id ? dbResult._id : false;
}

// input: thumbId, <object> { name, imageUrl, tags }
// output: thumbId on success or false
async function updateThumbnail( thumbId, myData ){
   // console.log(`[updateThumbnail] thumbId(${thumbId}) myEdit: `, myData);
   const thumbnailData = {
      name: myData.name,
      imageUrl: myData.imageUrl,
      tags: myData.tags
   };
   const dbResult = await db.thumbnail.findOneAndUpdate({_id: thumbId}, thumbnailData, {new: true});
   return dbResult._id ? dbResult._id : false;
}

// input: { thumbId }
// output: boolean on success
async function deleteThumbnail( thumbId ){
   const dbResult = await db.thumbnail.findByIdAndDelete(thumbId);
   return dbResult._id ? true : false;
}

// input: thumbId
// output: { thumbId, name, imageUrl, tags, creationTime } || false
async function getThumbnail( thumbId ){
   const dbData = await db.thumbnail.findById(thumbId);
   console.log( '[getThumbnail] dbData', dbData );
   if( !dbData ) {
      return false;
   }
   /* return consistent format data */
   return {
      thumbId: dbData._id,
      name: dbData.name,
      imageUrl: dbData.imageUrl,
      tags: dbData.tags,
      creationTime: dbData.createdAt
   };
}

// if we give a 'session', it will save that for this newly registered user
// OR if the user exists, it will UPDATE the session
// input: <object> { name, email, password }, session
// output: { message, id, name }
async function registerUser( userData, session='' ){
   if( !userData.name || (userData.type==='local' && !userData.email) ){
      console.log( '[registerUser] invalid userData! ', userData );
      return { message: 'Invalid user data', id: '', name: '' };
   }

   let passwordHash = '';
   if( !userData.type || userData.type==='local' ){
      if( !userData.password ){
         console.log( '[registerUser] invalid userData (need password)! ', userData );
         return { message: 'Invalid user password', id: '', name: '' };
      }
      const saltRounds = 10;
      passwordHash = await bcrypt.hash(userData.password, saltRounds);
      console.log( `[registerUser] (hash=${passwordHash}) req.body:`, userData );
      userData.type = 'local';
   }

   console.log( '[registerUser], userData: ', userData );



   // check if user exists, and refuse for local users, and quietly change just session for other types
   let duplicateUser = {};
   if( !userData.authId ){
      duplicateUser = await db.users.findOne({ email: userData.email });

      if( duplicateUser && duplicateUser._id ){
         return {
            error: 'Duplicate email, try another or login',
            id: false, session: false
         };
      }
   } else {
      duplicateUser = await db.users.findOne({ authId: userData.authId });

      if( duplicateUser && duplicateUser._id ){
         const saveUser = await db.users.findByIdAndUpdate( { _id: duplicateUser._id }, { session } );
         console.log( `   -> duplicate user (ie they've logged in before via oAuth), just update session: ${session}`, saveUser);
         return {
            message: `Welcome back ${saveUser.name}`,
            id: saveUser._id,
            name: saveUser.name,
            email: saveUser.email,
            thumbnail: saveUser.thumbnail,
            session,
            createdAt: saveUser.createdAt
         };
      }
   }


   const saveData = {
      name: userData.name,
      email: userData.email || '',
      thumbnail: userData.thumbnail || '',
      authId: userData.authId || '',
      password: passwordHash,
      type: userData.type,
      session
   };

   const dbUser = new db.users( saveData );
   const saveUser = await dbUser.save();
   return {
      message: `Success! ${saveUser.name} was successfully registered`,
      id: saveUser._id,
      name: saveUser.name,
      email: saveUser.email,
      thumbnail: saveUser.thumbnail,
      thumbnail: saveUser.thumbnail,
      session,
      createdAt: saveUser.createdAt
   };
}

// input: email, password
// output: <object> { userId, firstName, lastName, emailAddress, creationTime } || false
async function loginUser( email, password, session ) {
   if( !session ) {
      return { error: 'System error (session-not-given)' };
   }

   const userData = await db.users.findOne({ email: email });
   console.log( `[loadUser] email='${email}' userData:`, userData );
   if( !userData ) {
      return { error: 'Invalid password' };
   }

   const isValidPassword = await bcrypt.compare( password, userData.password );
   console.log( ` [loginUser] checking password (password: ${password} ) hash(${userData.password})`, isValidPassword );
   if( !isValidPassword ) {
      return { error: 'Invalid password' };
   }

   // add the suggested session to the user.
   userData.session = session;

   // update the session
   // remove entries before we do teh update
   delete userData.createdAt;
   delete userData.updatedAt;
   const dbResult = await db.users.findOneAndUpdate(
      { _id: userData._id},
      userData );

   // remap the data into the specified fields as we are using camelCase
   if( !dbResult._id ) {
      return {
         error: `Sorry problems logging in ${userData.name}`
      };
   }

   return {
      message: `Logging in ${userData.name}...`,
      id: userData._id,
      name: userData.name,
      email: userData.email,
      thumbnail: userData.thumbnail,
      session: userData.session,
      createdAt: userData.createdAt
   };
}

// input: session
// output: boolean
async function checkSession( session ){
   const userData = await db.users.findOne({ session });
   console.log( `[checkSession] session(${session}) -> valid? ${userData._id ? true : false}` );
   return( userData._id ? true : false );
}

// input: session
// output: boolean
async function logoutUser( session ){
   const userData = await db.users.findOneAndDelete({ session });
   console.log( `[logoutUser] session(${session})`, userData );
   return true; //( userData._id ? true : false );
}

// input: userId, thumbId
// output: boolean on success
async function addToCart(userId, productId){
   // const dbResult = await db.users.updateOne({_id:userID}, {$push: {favourites: mongoose.Types.ObjectId(thumbId)}});
   console.log( `[addToCard] Adding ${productId}` );
   const dbResult = await db.users.updateOne({_id:userId}, { $push: { favourites: mongoose.Types.ObjectId(thumbId) } });
   return dbResult.ok ? true : false;
}

// input: userId, thumbId
// output: boolean on success
async function removeFromCart(userId, thumbId){
   // const dbResult = await db.users.update({ObjectId:userId}, {$pull: {favourites: mongoose.Types.ObjectId(thumbId)}});
   const dbResult = await db.users.updateOne({_id:userId}, { $pull: { favourites: mongoose.Types.ObjectId(thumbId) } });
   return dbResult.ok ? true : false;
}

module.exports = {
   listThumbnails,
   saveThumbnail,
   deleteThumbnail,
   updateThumbnail,
   getThumbnail,
   addToCart,
   removeFromCart,
   registerUser,
   loginUser,
   checkSession,
   logoutUser
};