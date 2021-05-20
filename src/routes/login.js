const express = require('express');

const auth = require('../middleware/auth');
const { renderLoginView, loginUser } = require('../controllers/login');

const router = express.Router();

router.get('/', auth, renderLoginView).post('/', loginUser);

module.exports = router;
