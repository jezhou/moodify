var express = require('express');
var router = express.Router();

var cloudinary = require('cloudinary');

cloudinary_settings = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinary_settings);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('upload');
});

router.get('/test', function(req, res, next){
  console.log('Sending...');
  cloudinary.uploader.upload("public/images/christian.jpg", function(result){
    console.log(result);
  })
  res.send("success!");
});

module.exports = router;
