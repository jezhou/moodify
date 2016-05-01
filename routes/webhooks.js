var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.FACEBOOK_VALIDATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

module.exports = router;
