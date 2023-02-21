import express from 'express';
import { getBooks, createNewBook } from '../controllers/book';
import verifyToken from '../middlewares/verify_token';
import { isAdmin } from '../middlewares/verify_roles';
import uploadCloud from '../middlewares/uploader';

const router = express.Router();

// private routes
router.get('/', getBooks);

// chỉ verify những route nằm dưới verifyToken
router.use(verifyToken);
router.use(isAdmin);
router.post('/', uploadCloud.single('image'), createNewBook);

module.exports = router;
