const express = require('express');
const { createDue, renderEditDueView, editDue } = require('../controllers/due');
const { isAdmin } = require('../middleware/isAdmin');

const router = express.Router();
router.use(isAdmin);
router.route('/').post(createDue);
router.route('/:dueId').get(renderEditDueView).put(editDue);
module.exports = router;
