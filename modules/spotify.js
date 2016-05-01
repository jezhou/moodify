var exports = module.exports = {};

var request       = require('request');
var crypto        = require('crypto');
var cookieParser  = require('cookie-parser');
var qs            = require('querystring');
var jsonfile      = require('jsonfile');

var _ = require('underscore');

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
//
// var getAccessToken = function() {
//   var file = './spotify_temp.json';
//   jsonfile.readFile(file, function(err, obj) {
//
//     console.log(obj);
//     return obj.access_token;
//
//   });
// };

var seeds = [
  {"happiness": ["0rTkE0FmT4zT2xL6GXwosU", "6NPVjNh8Jhru9xOmyQigds", "3TGRqZ0a2l1LRblBkJoaDx"]},
  {"sadness": ["7pAT4dOUzjq8Ziap5ShIqC","19us48grixRwQkw1oRCFbp","0ENSn4fwAbCGeFGVUbXEU3"]},
  {"anger": ["7oK9VyNzrYvRFo7nQEYkWN","0x60P5taxdI5pcGbqbap6S","3K4HG9evC7dg3N0R9cYqk4"]}];

var stripURI = function(url) {
  var splitURI = url.split(":");
  return splitURI[splitURI.length - 1];
};

exports.getTopTracks = function(emotion, callback){
  // Top Tracks
  var options = {
    url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
    headers: { 'Authorization': 'Bearer ' + process.env.SPOTIFY_TOKEN },
    json: true
  }

  var topTracks = [];

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    var items = body.items;
    // Get two random top tracks
    topTracks = [stripURI(items.pop(_.random(0, items.length))["uri"])];
    topTracks.push(stripURI(items[_.random(0, items.length)]["uri"]));

    callback(emotion, topTracks);

  });

};

var tuning = function(emotion) {
  var res;
  if (emotion === "joy" || emotion === "happiness") {
    res = "&min_valence=0.8&min_danceability=0.7&min_energy=0.6&min_tempo=120";
  } else if (emotion === "sadness") {
    res = "&max_valence=0.5&max_danceability=0.5&max_tempo=142";
  } else if (emotion === "fear") {
    res = "";
  } else if (emotion === "disgust") {
    res = "";
  } else if (emotion === "anger"){
    res = "&max_valence=0.5&max_danceability=0.5&min_energy=0.6&min_tempo=120";
  }
  return res;
};

exports.recommendSong = function(emotion, topTracks){
  // seeding recommendations
  var options = {
    url: 'https://api.spotify.com/v1/recommendations/?seed_tracks=' + topTracks.join() + seeds[emotion].join() + tuning(emotion),
    headers: { 'Authorization': 'Bearer ' + process.env.SPOTIFY_TOKEN },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    console.log(body);
  });
};
