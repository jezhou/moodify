var exports = module.exports = {};
var request = require('request');

exports.analyzePhoto = function(imageURL, api_key) {
  request({
    url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
    qs: {Ocp-Apim-Subscription-Key: api_key},
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

    console.log(body);
  });
};