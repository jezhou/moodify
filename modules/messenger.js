var exports = module.exports = {};
var request = require('request');

var token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

exports.sendTextMessage = function (sender, text, callback) {
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

  // FOR SPOTIFY
  if(typeof callback === "function"){
    callback(sender);
  }
}

exports.sendImageMessage = function (sender, url){
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

exports.sendSpotifyMessage = function (sender, body) {

  console.log(body);

  console.log(body.album)

  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": body.name,
          "subtitle": body.artists[0].name,
          "image_url": body.album.images[0].url,
          "buttons": [{
            "type": "web_url",
            "url": "https://open.spotify.com/embed?uri=" + body.uri,
            "title": "Web url"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        }]
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
