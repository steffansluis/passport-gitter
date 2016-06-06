/* global describe, it, expect */
/* jshint expr: true */

var GitterStrategy = require('../lib/strategy');


describe('Strategy', function() {

  var strategy = new GitterStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});

  it('should be named gitter', function() {
    expect(strategy.name).to.equal('gitter');
  });

});
