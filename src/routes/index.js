const express = require('express');
const auth = require('../middleware/auth');
const { renderIndexView } = require('../controllers');

const router = express.Router();
router.get('/', auth, renderIndexView);
module.exports = router;
