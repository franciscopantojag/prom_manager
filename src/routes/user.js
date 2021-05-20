const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const { registerUser, renderRegisterView } = require('../controllers/register');

router.get('/', auth, renderRegisterView).post('/', registerUser);

module.exports = router;
