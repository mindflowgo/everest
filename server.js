require('dotenv').config(); // --> process.env
const express = require( 'express' );
const fs = require('fs');
const orm = require( './db/orm.mongoose' );

const PORT = process.env.PORT || 8080;

const app = express();
// const upload = require('multer')({ dest: 'public/uploads/' });

// app.use( express.static('client/build/') );
app.use( express.urlencoded({ extended: false }) );

app.get('/api/product/list', async function( req,res ){
    const products = JSON.parse( fs.readFileSync( "db/products.json" ) );

    res.send( products );
});

app.get('/api/product/:id', async function( req,res ){
    // parse the :id and serve ONE product.
    const products = JSON.parse( fs.readFileSync( "db/products.json" ) );
    const id = req.params.id;

    const product = products.filter( product=>product.id===id )[0]

    res.send( product );
});

app.post('/api/product/:id/review', async function( req,res ){

});

app.post('/api/user/registration', async function( req,res ){
    const userData = req.body;
    console.log( `[POST: /api/user/registration] userData: `, userData );
    
    const registerResult = await orm.registerUser( userData );
    res.send( registerResult );
})
app.listen( PORT, function(){
    console.log( `[everest server] RUNNING, http://localhost:${PORT}` );
 });