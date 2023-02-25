import express from 'express';
import { getBooks, createNewBook, updateBook, deleteBook } from '../controllers/book';
import verifyToken from '../middlewares/verify_token';
import { isCreatorOrAdmin } from '../middlewares/verify_roles';
import uploadCloud from '../middlewares/uploader';

const router = express.Router();

// public routes
router.get('/', getBooks);

// private routes
// chỉ verify những route nằm dưới verifyToken
router.use(verifyToken);
router.use(isCreatorOrAdmin);
router.post('/', uploadCloud.single('image'), createNewBook);
router.put('/', uploadCloud.single('image'), updateBook);
router.delete('/', deleteBook);

module.exports = router;
