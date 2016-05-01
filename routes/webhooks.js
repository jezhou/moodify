var express = require('express');
var request = require('request');
var router = express.Router();

var emotion = require('../modules/analyze');
var messenger = require('../modules/messenger');
var spotify = require('../modules/spotify');

var cloudinary = require('cloudinary');

/* GET validates Facebook */
router.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.FACEBOOK_VALIDATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }

  res.send('Error, wrong validation token.');
})

/* POST receives messages from Facebook, and responds with another POST request */
router.post('/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;

      //Send the oauth
      if(text === "spotify"){
        messenger.sendTextMessage(sender, "Please authenticate your Spotify by clicking the link below!");
        messenger.sendTextMessage(sender, spotify.generateOAuthURL());

      }
      else {
        emotion.analyzeText(text, sender, messenger.sendTextMessage, spotify.getTopTracks);
      }
    }
    else if(event.message && event.message.attachments[0].type === "image"){
      var url = event.message.attachments[0].payload.url;
      emotion.analyzePhoto(url, process.env.MICROSOFT_EMOTION_API, sender, messenger.sendTextMessage, spotify.getTopTracks);
    }
  }

  console.log(event);
  res.sendStatus(200);
});

module.exports = router;
