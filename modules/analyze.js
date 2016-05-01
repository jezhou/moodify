var exports = module.exports = {};
var request = require('request');
var watson = require('watson-developer-cloud');

var _ = require('underscore');

exports.analyzePhoto = function(imageURL, api_key, sender, callback) {
  request({
    url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": api_key
    },
    method: 'POST',
    json: {
      url: imageURL
    }
  }, function(error, response, body) {

    if (error) {
      console.log('Error sending message: ', error);
    }
    else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
    else if (body.length === 0){
      callback(sender, "I'm sorry, I can't find anyone in your photo :/");
      return;
    }

    emotions = body[0];
    highestEmotion = Object.keys(emotions).reduce(function(a, b){ return emotions[a] > emotions[b] ? a : b });

    if(typeof callback === "function"){
      callback(sender, "I found a face! It seems to be very " + highestEmotion + ". Here is a graph showing all of the emotions I see:");
    }
  });
};

exports.analyzeText = function(mytext, sender, callback) {
  var tone_analyzer = watson.tone_analyzer({
    username: process.env.WATSON_USER,
    password: process.env.WATSON_PASSWORD,
    version: 'v3-beta',
    version_date: '2016-02-11',
  });

  tone_analyzer.tone({ text: mytext },
    function(err, tone) {
      if (err)
        console.log(err);
      else{

        emotions = tone.document_tone.tone_categories[0].tones;
        highestEmotion = _.max(emotions, function(emotion){ return emotion.score});

        callback(sender, "You seem to have a lot of " + highestEmotion.tone_id "! Here is a graph showing all of your emotions:");
      }
  });
};
