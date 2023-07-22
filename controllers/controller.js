import dotenv from 'dotenv';
import Articles from '../mongoose_schema/schema.js';
import fs from 'fs';
import express from 'express';
import formatDate from '../public/assets/formatDate.js';
import multer from 'multer';
import {s3PutObject} from '../s3-bucket/s3.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientPath = process.cwd(),
    // formidable = require('formidable'),
    // Articles = require('../mongoose_schema/schema'),
    // fs = require('fs'),
    // express = require('express'),
    app = express(),
    // formatDate = require('../assets/formatDate'),
    // multer = require("multer"),
    pathImgBlog = '../public/img/blog-img/',
    noImagePath = '../public/img/blog-img/no-image.jpg',
    upload = multer({
        storage: multer.memoryStorage()
    });
// { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"),
// client = new S3Client({
//     credentials: {
//         accessKeyId: process.env.ACCESS_KEY_ID,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     },
//     region: process.env.REGION,
// });

app.use('/public', express.static(__dirname + '/public'));
app.use('/templates', express.static(__dirname + '/templates'));

const articles = (req, res, next) => {
    try {
        Articles.find({}, function (err, result) {
            if (err) next(err);
            res.status(200).json(result)
        });
    } catch (err) {
        console.log('Catched error', err);
        next(err)
    }
};

const categoryId = (req, res, next) => {
    fs.readFile(`${clientPath}/templates/categories/categories.html`, "utf8", (error, data) => {
        if (error) {
            console.log("Error read file categories.html " + error);
            return res.status(400).type('text/html').send('<h1>Error read file  categories.html</h1>');
        }
        let tag = (req.params.id).substring(1);
        Articles.find({categories: {$all: [tag]}}, (err, result) => {
            if (err) {
                console.log(err.stack)
                next(err);
            }
            if (result.length > 0) {
                let cardPost = result.map((post) => {
                    let postText;
                    const imagePath = post?.imgURL ? post.imgURL : `${pathImgBlog}/no-image.jpg`

                    if (typeof post.text == "string" && post.text.length > 150) {
                        postText = post.text.substr(0, 150) + "...";
                    } else {
                        postText = post.text;
                    }

                    return `<div class="single-latest-post d-flex">
                                  <div class="post-thumb">
                                  <a class="post-img" href="/single-post/${post._id}">
                                      <img
                                      src="${imagePath}"
                                      alt=""
                                      />
                                  </a>
                                  <p class="post-date">${formatDate(post.date)}</p>
                                   <p class="post-date">${post.categories.join('/')}</p>
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
                    .replace('{list_posts}', '<h2> No more posts </h2>');
                res.status(200).type('text/html');
                res.send(data);
            }
        })
    });
};

const singlePost = (req, res, next) => {
    fs.readFile(`${clientPath}/templates/single-post/single-post.html`, "utf8", (error, data) => {
        if (error) {
            console.log("Error read file single-post.html " + error);
            return res.status(400).type('text/html').send('<h1>Error read file single-post.html</h1>');
        }
        Articles.findById(req.params.id, (err, result) => {
            if (err) {
                console.log(err.stack)
                next(err);
            } else {
                const imagePath = result?.imgURL ? result.imgURL : noImagePath;
                data = data
                    .replace('{post_text}', result.text)
                    .replace('{date}', formatDate(result.date))
                    .replace('{title}', result.title)
                    .replace('{author}', result.author)
                    .replace('{tags}', result.categories.join("/"))
                    .replace('{image}', imagePath);
                res.status(200).type('text/html');
                res.send(data);
            }
        });
    });
};

const getPostById = (req, res) => {
    Articles.findById(req.params.id, (error, result) => {
        if (error) {
            console.log(`Article id ${req.params.id} is is missing. `, error);
            return res.status(400).json({error: `Article id ${req.params.id} is missing.`});
        }
        return res.status(200)
            .setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            .setHeader("Pragma", "no-cache")
            .setHeader("Expires", "0")
            .json(result)
    });
};

const getAddPostPage = (req, res) => {
    res.sendFile(`${clientPath}/templates/add-post/add-post.html`)
};

const addPost = async (req, res) => {
    const reqBody = req.body;
    const file = req.file;
    const newPost = {
        author: reqBody.authorPost,
        title: reqBody.titlePost,
        text: reqBody.textPost,
        date: reqBody.datePost,
        categories: JSON.parse(reqBody.tagsPost),
    };

    if (file) {
        const result = await s3PutObject(file);

        if (result) {
            newPost.imgURL = result;

            const newArticle = new Articles(newPost);
            newArticle.save((error) => {
                if (error) {
                    res.status(error?.status || 400).send('Failed to add post')
                    return console.log('newArticle save error ' + err);
                } else {
                    res.status(201).send('Post added successfully')
                }
            });
        } else {
            return res.status(412).send('Failed to upload image to S3 bucket');
        }
    } else {
        const newArticle = new Articles(newPost);
        newArticle.save((error) => {
            if (error) {
                res.status(error?.status || 400).send('Failed to add post')
                return console.log('newArticle save error ' + err);
            } else {
                res.status(201).send('Post added successfully')
            }
        });
    }
};

const getUpdatePostId = (req, res, next) => {
    fs.readFile(`${clientPath}/templates/update-post/update-post.html`, "utf8", (error, data) => {
        if (error) {
            console.log("Error read file update-post.html " + error);
            return res.status(400).type('text/html').send('<h1>Error read file update-postaf.html</h1>');
        }
        Articles.findById(req.params.id, (err, result) => {
            if (err) {
                console.log(err.stack)
                next(err);
            }

            const imagePath = result?.imgURL ? result.imgURL : noImagePath;
            data = data
                .replace('{id}', req.params.id)
                .replace('{post_author}', result.author)
                .replace('{post_title}', result.title)
                .replace('{post_imgType}', result?.img?.contentType)
                .replace('{post_img}', imagePath)
                .replace('{old_path_img}', result?.imgURL ? result.imgURL : '')
                .replace('{post_date}', formatDate(result.date))
                .replace('{post_tags}', result.categories.join())
                .replace('{post_id}', result.id)
                .replace('{post_text}', result.text);
            res.status(200).type('text/html').send(data);
        });
    });
};

const updatePostId = async (req, res) => {
    const reqBody = req.body;
    const file = req.file;
    const updatePost = {
        author: reqBody.authorPost,
        title: reqBody.titlePost,
        text: reqBody.textPost,
        date: reqBody.datePost,
        categories: JSON.parse(reqBody.tagsPost),
    };

    if (file) {
        const result = await s3PutObject(file);

        if (result) {
            updatePost.imgURL = result;
        } else {
            return res.status(412).send('Failed to upload image to S3 bucket');
        }
    }

    Articles.updateOne({_id: req.params.id}, updatePost, (error) => {
        if (error) {
            return res.status(error?.status || 400).send('Failed to update post')
        }

        console.log("Update successes Articles");
        res.status(201).send('Post edited successfully')
    });
};

const deletePost = (req, res, next) => {
    Articles.findOneAndDelete({_id: req.params.id}, function (err, result) {
        if (err || result == null) {
            console.log('Error /delete ' + err);
            return next(err);
        }
        res.status(200).json(result)
    });
};

export default {
    articles,
    categoryId,
    singlePost,
    getPostById,
    getAddPostPage,
    addPost,
    getUpdatePostId,
    updatePostId,
    deletePost
};


