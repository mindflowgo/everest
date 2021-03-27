require( 'dotenv' ).config() // looks for .env ; process.env gets it's values

const path = require('path')
const express = require('express')
const apiRouter = require('./app/router')
const app = express()
const orm = require('./app/db/orm.mongoose')

const PORT = process.env.PORT || 8080
const API_URL = process.env.NODE_ENV === 'production'
   ? 'https://everestapp.herokuapp.com' : `http://localhost:${PORT}`

if( !process.env.MONGODB_URI || !process.env.SESSION_SECRET ){
   console.log( '*ERROR* You need a .env file (with MONGODB_URI,SESSION_SECRET, and other oAuth entries...)' )
   process.exit()
}

// for parsing incoming POST data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
   // for serving REACT production-build content
   console.log( '> production: static from client/build' )
   app.use( express.static(path.join('client','build')) )
} else {
   // for serving all the normal html
   app.use( express.static('public') )
}

// oAuth

// for routes
apiRouter( app, API_URL )

// **OPTIONAL** If your REACT routing allows non-standard paths (ex. fake paths for React-Router)
// THEN you need to enable this for server-side serving to work
if (process.env.NODE_ENV === 'production') {
   app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, './client/build/index.html'))
   })
}

// seed database
orm.seedDatabase()

app.listen(PORT, function(){
   console.log( `Serving app on: http://localhost:${PORT}` )
})