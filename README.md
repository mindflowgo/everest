# Everest App
*NOTE* You need to go to the developer pages on the sites you want to offer oAuth for, and configure an app to allow the login.
 
For local debugging you should use an oAuth provider that allows you to set the
callback to http://localhost:8080/oauth/(provider)/callback.

Twitter and LinkedIn offer this. Use them for debugging.

The others (Google/Facebook/GitHub) do not, and so a more complicated local setup would be needed (to setup a https://localhost - ie creating https certificates). Don't bother, test 
them on a staging server later.


