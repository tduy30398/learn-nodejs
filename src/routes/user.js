const router = require('express').Router();
import user from '../controllers/user';

router.get('/', user.getUser);

module.exports = router;
