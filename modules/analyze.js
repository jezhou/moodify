var exports = module.exports = {};
var request = require('request');

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

    if(typeof callback === "function"){
      console.log("About to start the callback in analyzePhoto...");
      callback(sender, JSON.stringify(body));
      console.log("Finishing callback in analyzePhoto!");
    }
  });
};
