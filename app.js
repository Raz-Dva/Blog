// bodyParser = require('body-parser'),
// path = require('path'),

// const { Console } = require('console');
const http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    mongoose = require('mongoose'),
    multer = require("multer"),
    port = 5000,
    url = "mongodb://localhost:27017/",

    routers = require('./routers/route');


    // ------------  multer upload  --------
    upload = multer({
        storage: multer.memoryStorage()
    }).single('imgPost');

//---------------- express static
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


app.use('', routers);
// ------------  mongoose --------
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log('error connect mongoose DB' + err);
    server.on('error', () =>{
        console.log('Mongoose default connection error: ' + err);
    });
    server.listen(port, () => {
        console.log(`Server is run on port ${port}`)
    });
});


