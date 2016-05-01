var express = require('express');
var request = require('request');
var router = express.Router();

var emotion = require('../modules/analyze.js');

/* GET validates Facebook */
router.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.FACEBOOK_VALIDATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }

  res.send('Error, wrong validation token.');
})

router.post('/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
    else if(event.message && event.message.attachments[0].type === "image"){

      var url = event.message.attachments[0].payload.url;
      sendImageMessage(sender, url);

      var results = emotion.analyzePhoto(url, process.env.MICROSOFT_EMOTION_API);
      console.log(results);
      var facebox = results[0].faceRectangle;
      var emotions = results[0].scores;

      sendTextMessage(sender, "Here is your emotion report: " + JSON.stringify(emotions));

    }
  }

  console.log(event);
  res.sendStatus(200);
});

var token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendImageMessage(sender, url){
  messageData = {
    attachment: {
      type: 'image',
      payload: {
        url: url
      }
    }
  };

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });

}

module.exports = router;
