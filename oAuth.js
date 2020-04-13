const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { Strategy: TwitterStrategy } = require('passport-twitter');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: GithubStrategy} = require('passport-github');

// include server-side code for oAuth
// require('./oAuth')(app);
function oAuth( app, API_URL, providers, createOAuthSession ){
   console.log( '[oAuth] adding oAuth related endpoints & middleware' );

   // we need to enable API calls from OUTSIDE our system
   // as the oAuth will be coming from another server
   app.use( cors() );

   // oAuth requires session-library
   app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

   app.use(passport.initialize());
   // Allowing passport to serialize and deserialize users into sessions
   passport.serializeUser((user, cb) => cb(null, user));
   passport.deserializeUser((obj, cb) => cb(null, obj));

   // The callback is what the strategy uses below.
   const callback = (accessToken, refreshToken, profile, cb) => cb(null, profile, accessToken, refreshToken);

   // setup & call the passport pre-defined 'strategies' for each oAuth option
   // we have valid keys for
   providers.map( provider=>{
      if( process.env[`${provider.toUpperCase()}_KEY`] ){
         console.log( `   > found ** ${provider} ** KEY, Added!`);

         let CONFIG = {
            clientID: process.env[`${provider.toUpperCase()}_KEY`],
            clientSecret: process.env[`${provider.toUpperCase()}_SECRET`],
            callbackURL: `${API_URL}/oauth/${provider}/callback`
         };
         switch( provider ){
         case 'twitter':
            CONFIG.consumerKey = CONFIG.clientID;
            CONFIG.consumerSecret = CONFIG.clientSecret;
            passport.use(new TwitterStrategy(CONFIG, callback));
            break;
         case 'google':
            passport.use(new GoogleStrategy(CONFIG, callback));
            break;
         case 'facebook':
            CONFIG.profileFields = ['id', 'emails', 'name', 'picture.width(250)'];
            passport.use(new FacebookStrategy(CONFIG, callback));
            break;
         case 'github':
            passport.use(new GithubStrategy(CONFIG, callback));
            break;
         default:
            console.log( `[oAuth ERROR Unknown provider (${provider}); not doing anythiny.` );
            break;
         }
      }
   });

   // OAUTH ENDPOINTS
   // For the popup window, this will organize the initil login box on provider
   app.get( '/oauth/:provider', function( req,res,next ){
      const provider = req.params.provider;
      // we are running this, as it will generate code an actual function
      passport.authenticate(provider, (provider==='google'?{ scope: ['profile'] }:undefined))(req,res,next);
   });

   // this is called BY the provider with the auth-token + access-token + user-info for us
   app.get('/oauth/:provider/callback', function( req,res,next ){
      const provider = req.params.provider;
      // we are running this, as it will generate code an actual function
      passport.authenticate(provider, (provider==='google'?{ scope: ['profile'] }:undefined))(req,res,next);
   },
   // chain a SECOND function on that handles the call-back result
   async function( req,res ){
      const provider = req.params.provider;
      console.log( `[/oauth/${provider}/callback] writing result to DB & passing back opener` );

      // make the returned user structure consistent
      let user = { type: provider };
      switch( provider ){
      case 'twitter':
         user.name = req.user.displayName ? req.user.displayName : req.user.username;
         user.thumbnail = req.user.photos[0].value.replace(/_normal/, '');
         user.authId = `twitterid:${req.user.id}`;
         break;
      case 'google':
         user.name = req.user.displayName;
         user.thumbnail = req.user.photos[0].value.replace(/sz=50/gi, 'sz=250');
         user.authId = `googleid:${req.user.id}`;
         break;
      case 'facebook':
         user.name = `${req.user.name.givenName} ${req.user.name.familyName}`;
         user.thumbnail = req.user.photos[0].value;
         user.authId = `facebookid:${req.user.id}`;
         break;
      case 'github':
         user.name = req.user.username;
         user.thumbnail = req.user.photos[0].value;
         user.authId = `githubid:${req.user.id}`;
         break;
      default:
         console.log( `[ERROR] Unknown provider ${provider}` );
         break;
      }

      // create a session for this user
      const authUserData = JSON.stringify( await createOAuthSession( user ) );

      // this login info is secure [only on node side];
      // we don't need to send all of it to client, but we do in our case - for easy integration with prior login
      // it goes back to the popup authentication window, that then passes it on to the parent.

      // notify the calling (parent) window, and give our session + user info
      res.send(`<html><body><script>window.opener.postMessage('${authUserData}', '*');</script>Please wait...</body></html>`);
   });

}

module.exports = oAuth;