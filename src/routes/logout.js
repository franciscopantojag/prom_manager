const express = require('express');
const { logout } = require('../controllers/logout');
const auth = require('../middleware/auth');

const router = express.Router();

router.route('/').post(auth, logout);
module.exports = router;
