import express from 'express';
import controller from '../controllers/controller.js';
import multer from 'multer';

const router = express.Router(),
    // controller = require('../controllers/controller'),
    // multer = require('multer'),
    upload = multer({ storage: multer.memoryStorage()});

router.get('/articles', controller.articles);
router.get('/categories/:id', controller.categoryId);
router.get('/single-post/:id', controller.singlePostId);
router.get('/post/:id', controller.getPost);
router.get('/add-post', controller.getAddPost);
router.post('/add-post', controller.addPost);
router.get('/update-post/:id', controller.getUpdatePostId);
router.post('/update-post/:id', upload.single('imgPost'), controller.updatePostId);

export default router;
