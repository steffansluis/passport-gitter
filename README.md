# Passport-Gitter

[Passport](http://passportjs.org/) strategy for authenticating with [Gitter](https://gitter.im/)
using the OAuth 2.0 API.

This module lets you authenticate using Gitter in your Node.js applications.
By plugging into Passport, Gitter authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-gitter

## Usage

#### Configure Strategy

The Gitter authentication strategy authenticates users using a Gitter account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new GitterStrategy({
        clientID: GITTER_CLIENT_ID,
        clientSecret: GITTER_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/gitter/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ gitterId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'gitter'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/gitter',
      passport.authenticate('gitter', { scope: [ 'user:email' ] }));

    app.get('/auth/gitter/callback',
      passport.authenticate('gitter', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/steffansluis/passport-gitter.png)](http://travis-ci.org/steffansluis/passport-gitter)

## License

[The MIT License](http://opensource.org/licenses/MIT)
