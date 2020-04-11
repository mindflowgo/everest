require('dotenv').config(); // --> process.env
const express = require( 'express' );
const fs = require('fs');
const orm = require( './db/orm.mongoose' );

const PORT = process.env.PORT || 8080;

const app = express();
// const upload = require('multer')({ dest: 'public/uploads/' });

// PORT is only set by Heroku, else we know it's local
if( !process.env.PORT && !fs.existsSync('.env') ){
    console.log( `*ERROR* You need a .env file (with DB_NAME,...)` );
    process.exit();
}

app.use( express.static('client/build/') );
app.use( express.urlencoded({ extended: false }) );
app.use( express.json() );

// session checking middleware
async function needSession(req, res, next){
    console.log( `[middleware] session url(${req.url}) session(${req.headers.session || ''}) ` );
        
    // check session set, and it's valid
    if( !req.headers.session || 
        req.headers.session.length!==36 || 
        !(await orm.checkSession( req.headers.session )) ){
        console.log( `[middleware:session] invalid session, indicating redirect` );
        res.status(500).send( { error: "invalid session" } );
        return;
    }

    // session was good, let's continue endpoint processing...
    next();
}


app.get('/api/product/list', needSession, async function( req,res ){
    console.log( `[product/list] ` );
    const products = JSON.parse( fs.readFileSync( "db/products.json" ) );

    res.send( products );
});

app.get('/api/product/:id', needSession, async function( req,res ){
    // parse the :id and serve ONE product.
    const products = JSON.parse( fs.readFileSync( "db/products.json" ) );
    const id = req.params.id;

    const product = products.filter( product=>product.id===id )[0]

    res.send( product );
});

app.post('/api/product/:id/review', needSession, async function( req,res ){

});


app.post('/api/user/register', async function( req,res ){
    const userData = req.body;
    console.log( `[POST: /api/user/register] userData: `, userData );
    const registerResult = await orm.registerUser( userData );
    res.send( registerResult );
});

app.post('/api/user/login', async function( req,res ){
    const userData = req.body;
    console.log( `[POST: /api/user/login] userData: `, userData );
    const loginResult = await orm.loginUser( userData.email, userData.password );
    loginResult.rememberMe = req.body.rememberMe;
    res.send( loginResult );
});

app.post('/api/user/logout', needSession, async function( req,res ){
    console.log( `[POST: /api/user/logout] userData: ` );
    const logoutResult = await orm.logoutUser( req.headers.session );
    res.send( logoutResult );
});


// to allow the react url rewriting we need this
app.get('/*', function (req, res) {
    res.sendFile(`${__dirname}/build/index.html`);
  });

app.listen( PORT, function(){
    console.log( `[everest server] RUNNING, http://localhost:${PORT}` );
 });