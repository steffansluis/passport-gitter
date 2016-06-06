/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' === typeof json) {
    json = JSON.parse(json);
  }
  if (json instanceof Array) {
    json = json[0];
  }

  var profile = {};
  profile.id = String(json.id);
  profile.displayName = json.displayName;
  profile.username = json.username;
  profile.profileUrl = json.url;

  return profile;
};
