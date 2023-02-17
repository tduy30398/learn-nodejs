import express from 'express';
import { insertData } from '../controllers/insert';

const router = express.Router();

router.get('/', insertData);

export default router;
