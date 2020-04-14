# Everest App

For local debugging you should use an oAuth provider that allows you to set the
callback to http://localhost:8080/oauth/(provider)/callback.

Twitter and LinkedIn offer this. Google/Facebook/GitHub do not, and thus require a https://localhost,
which means you need to create https certificates. I wouldn't bother. Just test with the simpler ones,
and then on staging/production test the other ones.

