import express from 'express';
import { getCurrent } from '../controllers/user';
import { getBooks } from '../controllers/book';
import verifyToken from '../middlewares/verify_token';

const router = express.Router();

// private routes
router.get('/', getBooks);

// chỉ verify những route nằm dưới verifyToken
router.use(verifyToken);
router.get('/', getCurrent);

module.exports = router;
