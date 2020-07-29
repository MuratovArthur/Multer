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
 
var upload = multer({ storage: storage,  limits: {fileSize: 10000000} }).single('avatar')
var ModelSchema = new mongoose.Schema({
    avatar: String
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
       if (req.file === undefined){
        var avatar = "";
       } else {
        var avatar = req.file.filename;
       }
     
        var newModel = {avatar: avatar};
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