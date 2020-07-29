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
 
var upload = multer({ storage: storage,  limits: {fileSize: 10000000} }).array('photo', 2);
var ModelSchema = new mongoose.Schema({
    photo1: String,
    photo2: String
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
          var photo1 = "";
          var photo2 = "";
        } else {
          var photo1 = req.files[0].filename;
          var photo2 = req.files[1].filename;
        }
       
     
        var newModel = {photo1: photo1, photo2: photo2};
        Model.create(newModel, function(err, newModel){
        if(err){
          console.log(err);
        } else{
         console.log(newModel);
         res.redirect('/post');
      }
    });
    }

   
  });
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () =>
   console.log(`Server running on port ${PORT}`)
);