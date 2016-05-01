var express = require('express');
var router = express.Router();
var fs = require('fs');

var path = require('path')
var multer = require('multer');

var storage = multer.diskStorage({
  destination: 'upload/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

var upload = multer({ storage: storage })


var cloudinary = require('cloudinary');

cloudinary_settings = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinary_settings);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('upload_template');
});

router.post('/new', upload.single('displayImage'), function(req, res, next) {

  fs.readFile(req.file.path, function (err, data) {
    var newPath = __dirname + "/uploads/newfile";
    fs.writeFile(newPath, data, function (err) {
      res.redirect("back");
    });
  });

  res.send("success")
  
});

router.get('/test', function(req, res, next){
  console.log('Sending...');
  cloudinary.uploader.upload("public/images/christian.jpg", function(result){
    console.log(result);
  })
  res.send("success!");
});

module.exports = router;