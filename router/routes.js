import express from 'express';
import controller from '../controllers/controller.js';
import multer from 'multer';

const router = express.Router(),
    upload = multer( { storage: multer.memoryStorage() } );

router.get( '/articles', controller.articles );
router.get( '/categories/:id', controller.categoryId );
router.get( '/single-post/:id', controller.singlePost );
router.get( '/post/:id', controller.getPostById );
router.get( '/add-post', controller.getAddPostPage );
router.post( '/add-post', upload.single( 'imgPost' ), controller.addPost );
router.get( '/update-post/:id', controller.getUpdatePostId );
router.put( '/update-post/:id', upload.single( 'imgPost' ), controller.updatePostId );
router.delete( '/delete/:id', controller.deletePost );

export default router;
