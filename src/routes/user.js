import express from 'express';
import { getCurrent } from '../controllers/user';
import { isModeratorOrAdmin } from '../middlewares/verify_roles';
import verifyToken from '../middlewares/verify_token';

const router = express.Router();

// chỉ verify những route nằm dưới verifyToken
router.use(verifyToken);
router.use(isModeratorOrAdmin);
router.get('/', getCurrent);

module.exports = router;
