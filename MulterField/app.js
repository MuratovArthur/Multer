var express = require('express');
var multer  = require('multer');
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/multer", { useNewUrlParser: true, useUnifiedTopology: true });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage,  limits: {fileSize: 10000000} }).fields([{ name: 'purchasePhoto', maxCount: 2 }, { name: 'deffectPhoto', maxCount: 2 }]);

var ModelSchema = new mongoose.Schema({
    purchasePhoto1: String,
    purchasePhoto2: String,
    deffectPhoto1: String,
    deffectPhoto2: String
});

var Model = mongoose.model("Model", ModelSchema);
 
var app = express()

app.get('/', function (req, res) {
   res.render('home.ejs');
});
 
app.get('/post', function (req, res) {
   res.render('multer.ejs');
});

app.post('/post', function (req, res, next) {

	
	upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
       res.redirect('/');
       console.log('=======');
    } else if (err) {
       res.redirect('/');
    } else {

        console.log(req.files);

        if (req.files === undefined){
          var purchasePhoto1 = "";
          var purchasePhoto2 = "";
          var deffectPhoto1 = '';
          var deffectPhoto2 = '';
        } else {

          if (req.files.purchasePhoto === undefined) {
            var purchasePhoto1 = "";
            var purchasePhoto2 = "";
          } else {
            if (req.files.purchasePhoto[0] === undefined) {
              var purchasePhoto1 = "";
            } else {
               var purchasePhoto1 = req.files.purchasePhoto[0].filename;
            }
            if (req.files.purchasePhoto[1] === undefined) {
               var purchasePhoto2 = "";
            } else {
               var purchasePhoto2 = req.files.purchasePhoto[1].filename;
            }
          }

          

          if (req.files.deffectPhoto === undefined) {
            var deffectPhoto1 = "";
            var deffectPhoto2 = "";
          } else {
            if (req.files.deffectPhoto[0] === undefined) {
              var deffectPhoto1 = "";
            } else {
               var deffectPhoto1 = req.files.deffectPhoto[0].filename;
            }
            if (req.files.deffectPhoto[1] === undefined) {
               var deffectPhoto2 = "";
            } else {
                var deffectPhoto2 = req.files.deffectPhoto[1].filename;
            }
          }

        }

        var newModel = {purchasePhoto1: purchasePhoto1, purchasePhoto2: purchasePhoto2, deffectPhoto1: deffectPhoto1, deffectPhoto2: deffectPhoto2};
        Model.create(newModel, function(err, newModel){
        if(err){
          console.log(err);
        } else{
         console.log(newModel);
         res.redirect('/post');
      }
    });   
}});
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () =>
   console.log(`Server running on port ${PORT}`)
);