const express = require('express');
const auth = require('../middleware/auth');
const { gfsMid } = require('../middleware/gfs');
const { gfsStorage } = require('../middleware/gfsStorage');
const { sendSingleFile, uploadUserDue } = require('../controllers/files');

const router = express.Router();

router.use(auth, gfsMid, gfsStorage);
router
  .get('/', (req, res) => {
    res.send('Hello from files');
  })
  .post('/', uploadUserDue);
router.get('/:filename', sendSingleFile);

module.exports = router;
