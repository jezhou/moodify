var exports = module.exports = {};

var request       = require('request');
var crypto        = require('crypto');
var cookieParser  = require('cookie-parser');
var qs            = require('querystring');
var json      = require('jsonfile');

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

  return 'https://accounts.spotify.com/authorize?' + qs.stringify({
    response_type: 'code',
    client_id: client_id,
    redirect_uri: redirect_uri,
    scope: scopes
  });

}

var getAccessToken = function() {
  var file = '/models/spotify_temp.json'
  json.readFile(file, function(err, obj) {

    return obj.access_token;

  });
};

exports.getTopTracks = function(){
  // Top Tracks
  var options = {
    url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
    headers: { 'Authorization': 'Bearer ' + getAccessToken() },
    json: true
  }

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    console.log(body);
  });
};

exports.recommendSong = function(emotion){
  // Happy seed
  var options = {
    url: 'https://api.spotify.com/v1/recommendations/?seed_tracks=03Z9Xiu6te6MbMRlICuDGL,5ZZuiMFxl85qakgTZQapsc&max_valence=0.6&max_danceability=0.7&min_energy=0.4&min_tempo=120',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    console.log(body);
  });
};
