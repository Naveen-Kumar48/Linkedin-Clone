import { Router } from 'express';
import { createPost, getAllPosts, deletePost, commentPost, getCommentsByPost, delete_comment_of_user, increment_likes} from '../controllers/posts.controller.js';

import multer from 'multer';

const router = Router();

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: Storage });

router.route('/post').post(upload.single('media'), createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').delete(deletePost)
router.route('/comment').post(commentPost)
router.route('/get_comments').get(getCommentsByPost)
router.route('/delete_comment').delete(delete_comment_of_user)
router.route('/increment_post_likes').post(increment_likes)

export default router;



    