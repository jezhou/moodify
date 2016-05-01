var exports = module.exports = {};

var request       = require('request');
var crypto        = require('crypto');
var cookieParser  = require('cookie-parser');
var qs            = require('querystring');

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var redirect_uri = process.env.SPOTIFY_REDIRECT_URL;
var access_token, refresh_token;
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

exports.generateOAuthURL = function() {

  var stateKey = 'spotify_auth_state';
  var scopes = 'user-top-read user-follow-read user-library-read';
  var state = generateRandomString(16);

  return 'https://accounts.spotify.com/authorize?' + qs.stringify({
    response_type: 'code',
    client_id: client_id,
    redirect_uri: redirect_uri,
    state: state,
    scope: scopes
  });

}
