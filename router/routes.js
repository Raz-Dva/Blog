import express from 'express';
import controller from '../controllers/controller.js';
import multer from 'multer';

const router = express.Router(),
    upload = multer({ storage: multer.memoryStorage() });

router.get('/articles', controller.getAllPosts);
router.get('/categories/:id', controller.getPostsByQuery);
router.get('/single-post/:id', controller.singlePost);
router.get('/post/:id', controller.getPostById);
router.get('/add-post', controller.getAddPostPage);
router.post('/add-post', upload.single('imgPost'), controller.addPost);
router.get('/update-post/:id', controller.getUpdatePostById);
router.put('/update-post/:id', upload.single('imgPost'), controller.updatePostById);
router.get('/edit-posts', controller.editPosts);
router.delete('/delete/:id', controller.deletePost);

export default router;
