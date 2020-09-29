// const http = require('');

const http = require('http'),
express = require('express'),
app = express(),
server=http.createServer(app),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
fs=require('fs'),
multer = require("multer"),
ObjectID = require('mongodb').ObjectID,
formatDate = require('./assets/formatDate'),
Articles = require('./mongoose_sсhema/sсhema'),
// clientPath = __dirname + "\\templates",
 port = 5000,
path = require('path'),
 url = "mongodb://localhost:27017/",
// ------------  multer upload  --------

  upload = multer({
    storage: multer.memoryStorage()
}).single('imgPost');
////////////////////////
 app.use(express.static(__dirname + "/templates"));
 app.use('/public/css', express.static('public/css'));
 app.use('/public/fonts', express.static('public/fonts/'));
 app.use('/public/img/blog-img', express.static('public/img/blog-img'));
 app.use('/public/img/core-img', express.static('public/img/core-img'));
 app.use('/public/js/jquery', express.static('public/js/jquery'));
 app.use('/public/js/bootstrap', express.static('public/js/bootstrap'));
 app.use('/public/js/plugins', express.static('public/js/plugins'));
 app.use('/public/js', express.static('public/js'));
 app.use('/templates', express.static('templates'));

// ------------  route --------
app.get('/articles', (req, res) => {
    Articles.find({}, function (err, result) {
        if (err) {
            console.log('Error /get ' + err);
            return res.sendStatus(500);
        };
        res.status(200).json(result)
    });
});




// ------------  mongoose --------
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log('error connect mongoose DB' + err);

    server.on('error', function (e) {
        console.log('error' + e) // обработать ошибку
    });
    server.listen(port, () => {
        console.log(`Server is run on port ${port}`)
    });
});


