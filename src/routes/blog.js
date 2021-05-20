const express = require('express');
const auth = require('../middleware/auth');
const { renderBlogView } = require('../controllers/blog');

const router = express.Router();
router.get('/', auth, renderBlogView);
module.exports = router;
