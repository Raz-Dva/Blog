const Articles = require('../mongoose_sсhema/sсhema');
const fs = require('fs');
const clientPath = process.cwd();
const express = require('express');
const app = express();
const formatDate = require(clientPath + '\\assets\\formatDate');
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage()
}).single('imgPost');

app.use('/public', express.static('public'));
app.use('/templates', express.static('templates'));

module.exports.articles = (req, res, next) => {
  Articles.find({}, function (err, result) {
    if (err) {
      console.log(err.stack)
      next(err);
    };
    console.log(result)
    res.status(200).json(result)
  });
};

module.exports.categoriesId = (req, res, next) => {
  fs.readFile(`${clientPath}\\templates\\categories\\categories.html`, "utf8", (error, data) => {
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
};

module.exports.singlePostId = (req, res, next) => {
  fs.readFile(`${clientPath}\\templates\\single-post.html`, "utf8", (error, data) => {
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
};

module.exports.getAddPost = (req, res) => {
  res.sendFile(`${clientPath}\\templates\\add-post\\add-post.html`)
};

module.exports.addPost = (req, res, next) => {
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
    // console.log(req.body.tagsPost)
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
};

module.exports.getUpdatePostId = (req, res, next) => {
  fs.readFile(`${clientPath}\\templates\\update-post\\update-post.html`, "utf8", (error, data) => {
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
};

module.exports.updatePostId = (req, res) => {
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
};

module.exports.delete = (req, res, next) => {
  Articles.findOneAndDelete({ _id: req.params.id }, function (err, result) {
      if (err || result == null) {
          console.log('Error /delete ' + err);
          return next(err);
      };
      res.status(200).json(result)
  });
};