require('dotenv').config(); // --> process.env
const express = require( 'express' );
const fs = require('fs');
const uuid = require( 'uuid' );

const orm = require( './db/orm.mongoose' );

const PORT = process.env.PORT || 8080;
const API_URL = process.env.NODE_ENV === 'production'
   ? 'https://everestapp.herokuapp.com' : 'http://localhost:8080';

const app = express();
// const upload = require('multer')({ dest: 'public/uploads/' });

// PORT is only set by Heroku, else we know it's local
if( !process.env.PORT && !fs.existsSync('.env') ){
   console.log( '*ERROR* You need a .env file (with MONGODB_URI, SESSION_SECRET, GOOGLE_KEY/SECRET,...)' );
   process.exit();
}

// to server any static files in client/build
// note we do a /* at end for react URL re-writing
app.use( express.static('client/build/') );
// for post requests
app.use( express.urlencoded({ extended: false }) );
app.use( express.json() );

// session checking middleware
async function needSession(req, res, next){
   console.log( `[middleware] session url(${req.url}) session(${req.headers.session || ''}) ` );

   // check session set, and it's valid
   if( !req.headers.session ||
        req.headers.session.length!==36 ||
        !(await orm.checkSession( req.headers.session )) ){

      console.log( '[middleware:session] invalid session, indicating redirect' );
      res.status(403).send( { error: 'Requires valid session. Please login again.' } );
      return;
   }

   // session was good, let's continue endpoint processing...
   next();
}


// OAUTH Authentication
async function createOAuthSession( userData ){
   console.log( '[createOAuthSession]', userData );

   // register user in system (if they aren't there, and get the associated session)
   const session = uuid.v4();
   const authUserData = await orm.registerUser( userData, session );

   // returns the logged-in user info to javascript
   return authUserData;
}
// oAuth - list providers we'll accept .env info for
require('./oAuth')(app, API_URL, ['twitter','google','facebook','github'], createOAuthSession);



// ENDPOINTS      /---> next()
app.get('/api/product/list', needSession, async function( req,res ){
   console.log( '[product/list] ' );
   const products = JSON.parse( fs.readFileSync( 'db/products.json' ) );

   res.send( products );
});

app.get('/api/product/:id', needSession, async function( req,res ){
   // parse the :id and serve ONE product.
   const products = JSON.parse( fs.readFileSync( 'db/products.json' ) );
   const id = req.params.id;

   const product = products.filter( product=>product.id===id )[0];

   res.send( product );
});

app.post('/api/user/register', async function( req,res ){
   const userData = req.body;
   console.log( '[POST: /api/user/register] userData: ', userData );
   const registerResult = await orm.registerUser( userData );
   res.send( registerResult );
});

app.post('/api/user/login', async function( req,res ){
   const userData = req.body;
   console.log( '[POST: /api/user/login] userData: ', userData );
   const session = uuid.v4();
   const loginResult = await orm.loginUser( userData.email, userData.password, session );
   loginResult.rememberMe = req.body.rememberMe;
   res.send( loginResult );
});

app.post('/api/user/logout', needSession, async function( req,res ){
   console.log( '[POST: /api/user/logout] userData: ' );
   const logoutResult = await orm.logoutUser( req.headers.session );
   res.send( logoutResult );
});

app.get('/server-status', function(req, res){
   res.send({ status: 'running', time: Date.now() });
});

// to allow the react url rewriting (in production), we must pass all
// wildcard unknown URLs to react (ex. /productlist)
app.get('/*', function (req, res) {
   console.log( `[/*] (${req.protocol}//${req.get('host')}/${req.originalUrl} -- sending file: ${__dirname}/client/build/index.html` );
   res.sendFile(`${__dirname}/client/build/index.html`);
});

app.listen( PORT, function(){
   console.log( `[everest server] RUNNING, http://localhost:${PORT}` );
});