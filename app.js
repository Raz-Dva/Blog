
const http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    mongoose = require('mongoose'),
    port = 5000,
    url = "mongodb://localhost:27017/",
    controller = require('./controllers/controller');

//---------------- express static
app.use(express.static(__dirname + "/templates"));
app.use('/public', express.static('public'));
app.use('/templates', express.static('templates'));

// ------------  routes --------
app.get('/articles', controller.articles);
app.get('/categories/:id', controller.categoriesId);
//---------------- single post :id
app.get('/single-post/:id', controller.singlePostId);
//----------------  add new post
app.get('/add-post', controller.getAddPost);
app.post('/add-post', controller.addPost);
//---------------- update post
app.get('/update-post/:id', controller.getUpdatePostId);
app.post('/update-post/:id', controller.updatePostId);
//---------------- delete
app.delete('/delete/:id', controller.delete);
//---------------- error and 404
app.use((err, req, res, next) => {
    const isNotFound = ~err.message.indexOf('not found')
    const isCastError = ~err.message.indexOf('Cast to ObjectId failed')
    if (err.message && (isNotFound || isCastError)) {
        return next(err)
    }
    console.log(err.stack);
    res.status(404).json({ Error: err.stack })
});
app.get('*', function (req, res) {
    res.status(404).type('text/html');
    res.send("<h1> Not found 404</h1>");
});
// ------------  mongoose --------
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log('error connect mongoose DB' + err);

    server.on('error', function (e) {
        console.log('Mongoose default connection error: ' + err);
    });
    server.listen(port, () => {
        console.log(`Server is run on port ${port}`)
    });
});


