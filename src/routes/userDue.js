const express = require('express');

const {
  renderUserDueEditView,
  editUserDue,
  createUserDue,
  deleteUserDue,
  deleteFileForUserDue,
  uploadFileForUserDue,
} = require('../controllers/userDue');
const { gfsMid } = require('../middleware/gfs');
const { gfsStorage } = require('../middleware/gfsStorage');
const { isAdmin } = require('../middleware/isAdmin');

const router = express.Router();

router.use(isAdmin);
router.route('/').post(createUserDue);
router
  .route('/:userDueId')
  .get(renderUserDueEditView)
  .put(editUserDue)
  .delete(gfsMid, deleteUserDue);

router.route('/:userDueId/file').put(gfsStorage, uploadFileForUserDue);

router.route('/:userDueId/file/:fileId').delete(gfsMid, deleteFileForUserDue);

module.exports = router;
