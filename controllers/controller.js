import dotenv from 'dotenv';
import Articles from '../mongoose_schema/schema.js';
import fs from 'fs';
import express from 'express';
import formatDate from '../public/assets/formatDate.js';
import multer from 'multer';
import { s3PutObject } from '../s3-bucket/s3.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import generateCardPost from './templates/generate-card-post.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url),
    __dirname = dirname(__filename),
    clientPath = process.cwd(),
    app = express(),
    pathImgBlog = '../public/img/blog-img/',
    noImagePath = '../public/img/blog-img/no-image.jpg';
multer({
    storage: multer.memoryStorage()
});

app.use('/public', express.static(__dirname + '/public'));

const getAllPosts = (req, res, next) => {
    Articles.find({}, (error, result) => {
        if (error) {
            res.status(400).send('Articles find error ');
            next(error);

        } else {
            res.status(200).json(result);
        }
    });
};

const getPostsByQuery = (req, res, next) => {
    fs.readFile(
        `${clientPath}/public/templates/categories/categories.html`,
        'utf8',
        (error, data) => {
            if (error) {
                console.log('Error read file categories.html ', error);
                res.status(400).send('<h1>Error read file categories.html</h1>');
                return next(error);
            }
            const tag = (req.params.id).substring(1);

            Articles.find({ categories: { $all: [tag] } }, (error, result) => {
                if (error) {
                    console.log(error.stack);
                    next(error);
                }
                if (result.length > 0) {
                    const cardPost = result.map((post) => {
                        let postText;
                        const imagePath = post?.imgURL ? post.imgURL : `${pathImgBlog}/no-image.jpg`;

                        if (typeof post.text == 'string' && post.text.length > 150) {
                            postText = post.text.substr(0, 150) + '...';
                        } else {
                            postText = post.text;
                        }

                        return generateCardPost(post, imagePath, postText);
                    }).join(' ');

                    data = data
                        .replace('{categoria}', tag)
                        .replace('{list_posts}', cardPost);
                    res.status(200).type('text/html').send(data);
                } else {
                    data = data
                        .replace('{categoria}', tag)
                        .replace('{list_posts}', '<h2> No more posts </h2>');
                    res.status(200).type('text/html').send(data);
                }
            });
        });
};

const singlePost = (req, res, next) => {
    fs.readFile(
        `${clientPath}/public/templates/single-post/single-post.html`,
        'utf8',
        (error, data) => {
            if (error) {
                console.log('Error read file single-post.html ' + error);
                res.status(400)
                    .type('text/html')
                    .send('<h1>Error read file single-post.html</h1>');
                return next(error)
            }
            Articles.findById(req.params.id, (error, result) => {
                if (error) {
                    console.log(error.stack);
                    next(error);
                } else {
                    const imagePath = result?.imgURL ? result.imgURL : noImagePath;
                    data = data
                        .replace('{post_text}', result.text)
                        .replace('{date}', formatDate(result.date))
                        .replace('{title}', result.title)
                        .replace('{author}', result.author)
                        .replace('{tags}', result.categories.join('/'))
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
            return res.status(400).json({ error: `Article id ${req.params.id} is missing.` });
        }
        return res.status(200)
            .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            .setHeader('Pragma', 'no-cache')
            .setHeader('Expires', '0')
            .json(result);
    });
};

const getAddPostPage = (req, res, next) => {
    res.sendFile(`${clientPath}/public/templates/add-post/add-post.html`, (error) => {
        if (error) {
            console.log('File not found add-post.html', error);
            next(error);
        }
    });
};

const addPost = async(req, res) => {
    const reqBody = req.body;
    const file = req.file;
    const newPost = {
        author: reqBody.authorPost,
        title: reqBody.titlePost,
        text: reqBody.textPost,
        date: reqBody.datePost,
        categories: JSON.parse(reqBody.tagsPost)
    };

    if (file) {
        const result = await s3PutObject(file);

        if (result) {
            newPost.imgURL = result;

            const newArticle = new Articles(newPost);
            newArticle.save((error) => {
                if (error) {
                    res.status(error?.status || 500).send('Failed to add post');
                    return console.log('newArticle save error ' + error);
                } else {
                    res.status(201).send('Post added successfully');
                }
            });
        } else {
            return res.status(412).send('Failed to upload image to S3 bucket');
        }
    } else {
        const newArticle = new Articles(newPost);
        newArticle.save((error) => {
            if (error) {
                res.status(error?.status || 500).send('Failed to add post');
                return console.log('newArticle save error ' + error);
            } else {
                res.status(201).send('Post added successfully');
            }
        });
    }
};

const getUpdatePostById = (req, res, next) => {
    fs.readFile(
        `${clientPath}/public/templates/update-post/update-post.html`,
        'utf8',
        (error, data) => {
            if (error) {
                console.log('Error read file update-post.html ' + error);
                res.status(400)
                    .type('text/html')
                    .send('<h1>Error read file update-postaf.html</h1>');
                return next(error)
            }
            Articles.findById(req.params.id, (error, result) => {
                if (error) {
                    console.log(error.stack);
                    next(error);
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

const updatePostById = async(req, res) => {
    const reqBody = req.body;
    const file = req.file;
    const updatePost = {
        author: reqBody.authorPost,
        title: reqBody.titlePost,
        text: reqBody.textPost,
        date: reqBody.datePost,
        categories: JSON.parse(reqBody.tagsPost)
    };
    const idTimeOut = setTimeout(() => res.send('There was an error with the upstream service!'), 5000);

    if (file) {
        const result = await s3PutObject(file);
        clearTimeout(idTimeOut);
        if (result) {
            updatePost.imgURL = result;
        } else {
            return res.status(412).send('Failed to upload image to S3 bucket');
        }
    }

    Articles.updateOne({ _id: req.params.id }, updatePost, (error) => {
        clearTimeout(idTimeOut);
        if (error) {
            return res.status(error?.status || 400).send('Failed to update post');
        }

        console.log('Update successes Articles');
        res.status(201).send('Post edited successfully');
    });
};

const editPosts = (req, res, next) => {
    res.sendFile(`${clientPath}/public/templates/posts-editor/posts-editor.html`, (error) => {
        if(error) {
            console.log('File not found posts-editor.html', error);
            next(error);
        }
    })
}

const deletePost = (req, res, next) => {
    Articles.findOneAndDelete({ _id: req.params.id }, (error, result) => {
        if (error || result === null) {
            res.status(404).send(`Error delete ${error?.message || error?.reason}`);
            next(error);
        }
        res.status(200).json(result);
    });
};

export default {
    getAllPosts,
    getPostsByQuery,
    singlePost,
    getPostById,
    getAddPostPage,
    addPost,
    getUpdatePostById,
    updatePostById,
    editPosts,
    deletePost
};
