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
  // var state = req.query.state || null;
  // var storedState = req.cookies ? req.cookies[stateKey] : null;

  // if (state === null || state !== storedState) {
  //   res.redirect('/#' +
  //     qs.stringify({
  //       error: 'state_mismatch'
  //     }));
  // } else {
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

        // Shitty storage
        jsonfile.writeFile(file, obj, function(err) {
          console.error(err);
        })

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

// Algorithm
var songToSongClass = function(songFeatures) {
  // HAPPY IS AVERAGE OF DANCEABILITY + VALENCE > 0.6
  // HIGH NEUTRAL -> ANGER IS HIGH ENERGY AND 1 of LOW DANCEABILITY, LOW VALENCE
  // SAD IS LOW VALENCE AND 1 OF LOW TEMPO, LOW DANCEABILITY
  var emotions = [], emotion;
  for (var i = 0; i < songFeatures.length; i++) {
    var valence = songFeatures[i]["valence"],
        energy = songFeatures[i]["energy"],
        danceability = songFeatures[i]["danceability"],
        tempo = songFeatures[i]["tempo"];
    if (valence > 0.7) {
      emotion = "happy";
    }
    else if (energy > 0.6 && (danceability < 0.5 || valence < 0.5)) {
      emotion = "angry";
    }
    else if (valence < 0.5 && (tempo < 120 || danceability < 0.5)) {
      emotion = "sad";
    } else {
      emotion = "neutral";
    }
    // Push to array
    emotions.push({'track_href': songFeatures[i]["track_href"], 'emotion': emotion});
  }
  return emotions;
};

var faceToSong = function (songEmotions, face) {
  if (face === '[]') {
    return {error: 'YO, NO FACE PUNKASS.'};
  }
  // Determine emotion first.
  // sad -> max_valence=0.5&max_danceability=0.5&max_tempo=142
  // happy hardcode seeds -> I feel good (0rTkE0FmT4zT2xL6GXwosU), Happy (6NPVjNh8Jhru9xOmyQigds), Call me Maybe (3TGRqZ0a2l1LRblBkJoaDx)
  // happy -> min_valence=0.8&min_danceability=0.7&min_energy=0.6&min_tempo=120
  // happy -> 0rTkE0FmT4zT2xL6GXwosU,6NPVjNh8Jhru9xOmyQigds,3TGRqZ0a2l1LRblBkJoaDx,
  // anger -> max_valence=0.5&max_danceability=0.5&min_energy=0.6&min_tempo=120

};

module.exports = router;
