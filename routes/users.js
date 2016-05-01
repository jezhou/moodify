var express = require('express');
var router = express.Router();

var emotion = require('../modules/analyze');

/* GET users listing. */
router.get('/', function(req, res, next) {

  emotion.analyzePhoto('https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/537924_10151314522845369_884590006_n.jpg?oh=caff25545aa89062fcff8081da2ed253&oe=579B8DCB',
    process.env.MICROSOFT_EMOTION_API);

  console.log(process.env.MICROSOFT_EMOTION_API);

  res.send('respond with a resource');
});

module.exports = router;
