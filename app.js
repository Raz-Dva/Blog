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
clientPath = __dirname + "\\templates",
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
//-------------- find all from mongoose schema
app.get('/articles', (req, res) => {
    Articles.find({}, function (err, result) {
        if (err) {
            console.log('Error find all from mongoose schema' + err);
            return res.sendStatus(500);
        };
        res.status(200).json(result)
    });
});

//----------------page categoris:id
app.get('/categories/:id', (req, res) => {
    fs.readFile(`${clientPath}\\/categories/categories.html`, "utf8", (error, data) => {
        if (error) {
            console.log("Error read file categories.html " + error) 
        };
        let tag = (req.params.id).substring(1);
        Articles.find({categories:{$all: [tag]}}, (err, result)=>{ 
            if(err){
                console.log('Error find categories ' + err);
                return false;
            };
            if(result.length>0){
                let cardPost = result.map((post)=>{
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
                .replace('{list_posts}', cardPost)
                .replace('{categoria}', tag);
    
                res.status(200).type('text/html');
                res.send(data);
            } else{
                data=data.replace('{list_posts}', '<h2> No posts </h2>')
                res.send(data);
            }
        })
    });
});

//---------------- single post :id
app.get('/single-post/:id', (req, res) => {
    fs.readFile(`${clientPath}\\single-post.html`, "utf8", (error, data) => {
        if (error) {
            console.log("Error read file single-post.html " + error)
        }
        Articles.findOne({ _id: ObjectID(req.params.id) }, (err, result) => {
            console.log(result)
            if (err || result == null) {
                console.log('Error get post by ID ' + err)
                return res.sendStatus(500);
            };
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
        });
    });
});

//---------------- error 404

app.use((req, res, next) => {
    res.status(404).type('text/html');
    res.send("<h1> Not found 404</h1>");
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


