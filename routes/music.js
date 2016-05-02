var express       = require('express');
var request       = require('request');
var crypto        = require('crypto');
var cookieParser  = require('cookie-parser');
var qs            = require('querystring');
var jsonfile          = require('jsonfile');

var router = express.Router();

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var redirect_uri = process.env.SPOTIFY_REDIRECT_URL;
var access_token, refresh_token;
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';
var scopes = 'playlist-read-private user-top-read playlist-read-collaborative user-follow-read user-library-read';
router.use(express.static(__dirname + '/public'))
   .use(cookieParser());

router.get('/', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  res.redirect('https://accounts.spotify.com/authorize?' +
    qs.stringify({
      response_type: 'code',
      client_id: client_id,
      redirect_uri: redirect_uri,
      state: state,
      scope: scopes
    }));
});

router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  console.log("Jesse Code is: " + code);

    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };



    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var file = './spotify_temp.json';
        var obj = {
          access_token: body.access_token,
          refresh_token: body.refresh_token
        };

        console.log(obj);

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          qs.stringify({
            access_token: obj.access_token,
            refresh_token: obj.refresh_token
          }));

      } else {
        res.redirect('/#' +
          qs.stringify({
            error: 'invalid_token'
          }));
      }
    });
  // }
});

router.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

module.exports = router;
