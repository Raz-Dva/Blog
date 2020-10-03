
const { Console } = require('console');
const http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    mongoose = require('mongoose'),
    // bodyParser = require('body-parser'),
    fs = require('fs'),
    multer = require("multer"),
    formatDate = require('./assets/formatDate'),
    Articles = require('./mongoose_sсhema/sсhema'),
    clientPath = __dirname + "\\templates",
    port = 5000,
    // path = require('path'),
    url = "mongodb://localhost:27017/",
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

// ------------  route --------
//-------------- find all from mongoose schema
app.get('/articles', (req, res, next) => {
    Articles.find({}, function (err, result) {
        if (err) {
            console.log(err.stack)
            next(err);
        };
        res.status(200).json(result)
    });
});

//----------------page categories:id
app.get('/categories/:id', (req, res, next) => {
    fs.readFile(`${clientPath}\\/categories/categories.html`, "utf8", (error, data) => {
        if (error) {
            console.log("Error read file categories.html " + error);
            return res.status(400).type('text/html').send('<h1>Error read file  categories.html</h1>');
        };
        let tag = (req.params.id).substring(1);
        Articles.find({ categories: { $all: [tag] } }, (err, result) => {
            if (err) {
                console.log(err.stack)
                next(err);
            };
            if (result.length > 0) {
                let cardPost = result.map((post) => {
                    let postText;
                    if (typeof post.text == "string" && post.text.length > 150) {
                        postText = post.text.substr(0, 150) + "...";
                    } else postText = post.text;
                    return `<div class="single-latest-post d-flex">
                                <div class="post-thumb">
                                <a class="post-img" href="/single-post/${post._id}">
                                    <img
                                    src="data:${post.img.contentType};base64, ${post.img.data.toString('base64')}"
                                    alt=""
                                    />
                                </a>
                                <p class="post-date">
                                    ${formatDate(post.date)}/${post.categories.join('/')}
                                </p>
                                </div>
                                <div class="post-content">
                                <a href="/single-post/${post._id}" class="post-title">
                                    <h6>${post.title}</h6>
                                </a>
                                <p class="post-excerpt">${postText}</p>
                                <p class="post-author"><span>by</span> Colorlib</p>
                                </div>
                            </div>`
                }).join(' ');

                data = data
                    .replace('{categoria}', tag)
                    .replace('{list_posts}', cardPost);
                res.status(200).type('text/html');
                res.send(data);
            } else {
                data = data
                .replace('{categoria}', tag)
                .replace('{list_posts}', '<h2> No posts </h2>');
                res.status(200).type('text/html');
                res.send(data);
            }
        })
    });
});
//---------------- single post :id
app.get('/single-post/:id', (req, res, next) => {
    fs.readFile(`${clientPath}\\single-post.html`, "utf8", (error, data) => {
        if (error) {
            console.log("Error read file single-post.html " + error);
            return res.status(400).type('text/html').send('<h1>Error read file single-post.html</h1>');
        }
        Articles.findById(req.params.id, function (err, result) {
            if (err) {
                console.log(err.stack)
                next(err);
            } else {
                let imgResult = result.img.data.toString('base64');
                let imageBase64 = `data:${result.img.contentType};base64, ${imgResult} `;
                data = data
                    .replace('{post_text}', result.text)
                    .replace('{date}', formatDate(result.date))
                    .replace('{title}', result.title)
                    .replace('{author}', result.author)
                    .replace('{tags}', result.categories.join("/"))
                    .replace('{image}', imageBase64);
                res.status(200).type('text/html');
                res.send(data);
            }
        });
    });
});
//----------------  add new post
app.get('/add-post', (req, res) => {
    res.sendFile(`${clientPath}\\/add-post/add-post.html`)
});
app.post('/add-post', (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            console.log(err.stack);
            next(err);
        }
        var bodyImg, buffer, fileType;
        if (req.file) {
            buffer = req.file.buffer;
            fileType = req.file.mimetype;
        } else {
            var readFileimg = fs.readFileSync('./public/img/blog-img/no-image.jpg');
            buffer = Buffer.from(readFileimg);
            fileType = 'image/jpeg';
        }
        bodyImg = {
            data: buffer,
            contentType: fileType
        };
        console.log(req.body.tagsPost)
        var newPost = {
            author: req.body.authorPost,
            title: req.body.titlePost,
            text: req.body.textPost,
            date: req.body.datePost,
            img: bodyImg,
            categories: JSON.parse(req.body.tagsPost)
        };
        const newArticle = new Articles(newPost);
        newArticle.save(function (err) {
            if (err) {
                return console.log('newArticle save error' + err);
                next(err)
            }
            console.log("Object saved as 'newArticle'");
            res.send('Post added successfully')
        });
    })
});

//---------------- update post
app.get('/update-post/:id', (req, res, next) => {
    fs.readFile(`${clientPath}\\/update-post/update-post.html`, "utf8", (error, data) => {
        if (error) {
            console.log("Error read file update-post.html " + error);
            return res.status(400).type('text/html').send('<h1>Error read file update-postaf.html</h1>');
        }
        Articles.findById(req.params.id, (err, result) => {
            if (err) {
                console.log(err.stack)
                next(err);
            };
            let imgResult = result.img.data.toString('base64');
            data = data
                .replace('{id}', req.params.id)
                .replace('{post_author}', result.author)
                .replace('{post_title}', result.title)
                .replace('{post_imgType}', result.img.contentType)
                .replace('{post_img}', imgResult)
                .replace('{post_date}', formatDate(result.date))
                .replace('{post_tags}', result.categories.join())
                .replace('{post_text}', result.text);
            res.status(200).type('text/html');
            res.send(data);
        });
    });
});
app.post('/update-post/:id', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err.stack)
            next(err);
        }
        var finalImg, updatePost;
        var reqBody = {
            author: req.body.authorPost,
            title: req.body.titlePost,
            text: req.body.textPost,
            date: req.body.datePost,
            categories: JSON.parse(req.body.tagsPost)
        };
        if (req.file == undefined || req.file == true) {
            updatePost = reqBody;
        } else {
            var buffer = req.file.buffer;
            finalImg = {
                data: buffer,
                contentType: req.file.mimetype
            };
            updatePost = reqBody;
            updatePost.img = finalImg;
        }
        Articles.updateOne({ _id: req.params.id }, updatePost, function (error) {
            if (err) {
                console.log(err.stack)
                next(err);
            } 
            console.log("Update succsses Articles");
            res.send('Post edited successfully')
        });
    })
});

//---------------- delete
app.delete('/delete/:id', (req, res, next) => {
    Articles.findOneAndDelete({ _id: req.params.id }, function (err, result) {
        if (err || result == null) {
            console.log('Error /delete ' + err);
            // return res.sendStatus(500);
           return next(err);
        };
        //res send json error
        res.status(200).json(result)
    });
});
//---------------- error and 404
app.use((err, req, res, next) => {
    const isNotFound = ~err.message.indexOf('not found')
    const isCastError = ~err.message.indexOf('Cast to ObjectId failed')
    if (err.message && (isNotFound || isCastError)) {
        return next(err)
    }
    console.log(err.stack);
    res.status(404).json({ Error: err.stack })
})

app.get('*', function (req, res) {
    res.status(404).type('text/html');
    res.send("<h1> Not found 404</h1>");
})
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


