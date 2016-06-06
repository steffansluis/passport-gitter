/* global describe, it, expect, before */
/* jshint expr: true */

var GitHubStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {

  describe('loading profile using custom URL', function() {
    var strategy =  new GitHubStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://api.gitter.im/v1/user',
      },
      function() {});

    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      var testcases = {
        'https://api.gitter.im/v1/user': '{ "username": "octocat", "id": 1, "displayName": "monalisa octocat", "url": "https://gitter.im/octocat" }'
      };

      var body = testcases[url] || null;
      if (!body) {
        return callback(new Error('wrong url argument'));
      }

      if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

      callback(null, body, undefined);
    };


    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('gitter');

      expect(profile.id).to.equal('1');
      expect(profile.username).to.equal('octocat');
      expect(profile.displayName).to.equal('monalisa octocat');
      expect(profile.profileUrl).to.equal('https://gitter.im/octocat');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });

});
