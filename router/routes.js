const express = require("express");
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/articles', controller.articles);
router.get('/categories/:id', controller.categoryId);
router.get('/single-post/:id', controller.singlePostId);
router.get('/post/:id', controller.getPost);
router.get('/add-post', controller.getAddPost);
router.post('/add-post', controller.addPost);
router.get('/update-post/:id', controller.getUpdatePostId);
router.post('/update-post/:id', controller.updatePostId);

module.exports = router;
