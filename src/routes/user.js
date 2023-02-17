import express from 'express';
import { getCurrent } from '../controllers/user';
import verifyToken from '../middlewares/verify_token';

const router = express.Router();

// chỉ verify những route nằm dưới verifyToken
router.use(verifyToken);
router.get('/', getCurrent);

module.exports = router;
