const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const passport = require('passport')
const { Strategy: TwitterStrategy } = require('passport-twitter')
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth')
const { Strategy: FacebookStrategy } = require('passport-facebook')
const { Strategy: GithubStrategy} = require('passport-github')

// include server-side code for oAuth
// require('./oAuth')(app);
function oAuth( app, API_URL ){
    console.log( `[oAuth] adding oAuth related endpoints & middleware` );

    const server = http.createServer(app);
    const io = socketio(server);

    // we need to enable API calls from OUTSIDE our system
    // as the oAuth will be coming from another server
    app.use( cors() );
        
    app.use(passport.initialize())
    // Allowing passport to serialize and deserialize users into sessions
    passport.serializeUser((user, cb) => cb(null, user))
    passport.deserializeUser((obj, cb) => cb(null, obj))
    
    // The callback is what the strategy uses below.
    const callback = (accessToken, refreshToken, profile, cb) => cb(null, profile, accessToken, refreshToken)

    // setup & call the passport pre-defined 'strategies' for each oAuth option 
    // we have valid keys for
    const providers = ['twitter','google','facebook','github'];
    providers.map( provider=>{
        if( process.env[`${provider.toUpperCase()}_KEY`] ){
            console.log( `   > found ** ${provider} ** KEY, Added!`)

            let CONFIG = { 
                clientID: process.env[`${provider.toUpperCase()}_KEY`],
                clientSecret: process.env[`${provider.toUpperCase()}_SECRET`],
                callbackURL: `${API_URL}/oauth/${provider}/callback`
            }
            switch( provider ){
                case 'twitter':
                    CONFIG.consumerKey = CONFIG.clientID;
                    CONFIG.consumerSecret = CONFIG.clientSecret;
                    passport.use(new TwitterStrategy(CONFIG, callback));
                    break;
                case 'google':
                    console.log( `   .. CONFIG:`+JSON.stringify(CONFIG) )
                    passport.use(new GoogleStrategy(CONFIG, callback));
                    break;
                case 'facebook':
                    CONFIG.profileFields = ['id', 'emails', 'name', 'picture.width(250)'];
                    passport.use(new FacebookStrategy(CONFIG, callback));
                    break;
                case 'github':
                    passport.use(new GithubStrategy(CONFIG, callback));
                    break;
            }
        }
    })
    
    // setup callback paths
    app.get( '/oauth/:provider', function( req,res,next ){
        const provider = req.params.provider;
        // we are running this, as it will generate code an actual function
        passport.authenticate(provider)(req,res,next);
    });

    app.get('/oauth/:provider/callback', function( req,res,next ){
            const provider = req.params.provider;
            // we are running this, as it will generate code an actual function
            passport.authenticate(provider)(req,res,next);
        }, 
        function( req,res,next ){
            const provider = req.params.provider;
            const socketId = req.query.socketId; // passed with the first popup as a ?socketId=
            console.log( `[/oauth/:provider/callback] provider(${provider}) socketId(${socketId})` );

            // make the returned user structure consistent
            let user;
            switch( provider ){
                case 'twitter':
                    user = { name: req.user.username, photo: req.user.photos[0].value.replace(/_normal/, '') }
                    break
                case 'google':
                    user = { name: req.user.displayName, photo: req.user.photos[0].value.replace(/sz=50/gi, 'sz=250') }
                    break
                case 'facebook':
                    user = { name: `${req.user.name.givenName} ${req.user.name.familyName}`, photo: req.user.photos[0].value }
                    break
                case 'github':
                    user = { name: req.user.username, photo: req.user.photos[0].value }
                    break
                default:
                    console.log( `[ERROR] Unknown provider ${provider}` )
                    break
            }
            io.in(socketId).emit('oauth_result', user)
            res.end()
        })

}

module.exports = oAuth;