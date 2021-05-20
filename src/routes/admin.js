const express = require('express');

const router = express.Router();
const { renderAdminView } = require('../controllers/admin');
const { isAdmin } = require('../middleware/isAdmin');

router.get('/', isAdmin, renderAdminView);

module.exports = router;
