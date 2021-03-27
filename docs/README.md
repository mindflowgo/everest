# Everest App

Welcome! This sample application showcases a basic shopping cart tool. It also shows usage of a simple 
RESTful API that has user sessions; and finally it offers an oAuth capability to login.

## Install ##
1. git clone repo
2. npm install
2. modify .env file (if needed; first 2 lines are needed, others you can add KEY/SECRET entries depend on your oAuth needs):
```
MONGODB_URI=mongodb://localhost/everest
SESSION_SECRET=s3cr3tl00t
TWITTER_KEY=...
TWITTER_SECRET=...
GOOGLE_KEY=...
GOOGLE_SECRET=...
```
3. npm start

## Developer Notes ##
If you want to adjust the React front-end, you need to install a few developer dependencies
1. npm install -g concurrently nodemon
2. npm run install   (this will install all the react dependencies)

finall:
`npm run start:dev`

This will run the server under nodemon, so any changes on it will trigger a reload, and likewise, will run the front-end under the normal React dev environment to allow reloading.


*NOTE* You need to go to the developer pages on the sites you want to offer oAuth for, and configure an app to allow the login.

For local debugging you should use an oAuth provider that allows you to set the
callback to http://localhost:8080/oauth/(provider)/callback.

Twitter and LinkedIn offer this. Use them for debugging.

The others (Google/Facebook/GitHub) do not, and so a more complicated local setup would be needed (to setup a https://localhost - ie creating https certificates). Don't bother, test 
them on a staging server later.


