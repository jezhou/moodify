var exports = module.exports = {};
var request = require('request');
var watson = require('watson-developer-cloud');

exports.analyzePhoto = function(imageURL, api_key) {
  request({
    url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
    qs: {"Ocp-Apim-Subscription-Key": api_key},
    method: 'POST',
    json: {
      url: imageURL
    }
  }, function(error, response, body) {
    // if (error) {
    //   console.log('Error sending message: ', error);
    // }
    // else if (response.body.error) {
    //   console.log('Error: ', response.body.error);
    // }

    console.log(body);
  });
};

exports.analyzeText = function(mytext) {
  var tone_analyzer = watson.tone_analyzer({
    username: process.env.WATSON_USER,
    password: process.env.WATSON_PASSWORD,
    version: 'v3-beta',
    version_date: '2016-02-11'
  });

  tone_analyzer.tone({ text: 'Greetings from Watson Developer Cloud!' },
    function(err, tone) {
      if (err)
        console.log(err);
      else
        console.log(JSON.stringify(tone, null, 2));
  });
};