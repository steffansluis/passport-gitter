/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Gitter authentication strategy authenticates requests by delegating to
 * Gitter using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Gitter application's Client ID
 *   - `clientSecret`  your Gitter application's Client Secret
 *   - `callbackURL`   URL to which Gitter will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new GitterStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/gitter/callback',
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  options.authorizationURL = options.authorizationURL || 'https://gitter.im/login/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://gitter.im/login/oauth/token';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  OAuth2Strategy.call(this, options, verify);
  this.name = 'gitter';
  this._userProfileURL = options.userProfileURL || 'https://api.gitter.im/v1/user';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Gitter.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `gitter`
 *   - `id`               the user's Gitter ID
 *   - `username`         the user's Gitter username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on Gitter
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;

  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider  = 'gitter';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
