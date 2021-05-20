const UserDue = require('../models/userDue');

exports.fileFilter = async (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.errorFileFilter = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  const { userDueId } = req.params;
  try {
    const userDue = await UserDue.findById(userDueId).exec();
    if (!userDue) {
      req.errorFileFilter = 'No se encontro la cuota especifica';
      return cb(new Error('error especifico'), false);
    }
    if (userDue.state === 'Pagado') {
      req.errorFileFilter = 'Bad request';
      return cb(new Error('error especifico'), false);
    }
    if (!Array.isArray(userDue.files)) {
      req.errorFileFilter = 'Bad request';
      return cb(new Error('error especifico'), false);
    }
    if (userDue.files.length >= 3) {
      req.errorFileFilter = 'Se excedio el numero de intentos';
      return cb(new Error('error especifico'), false);
    }
    req.userDue = userDue;
  } catch (err) {
    console.log(err);
    req.errorFileFilter = 'error especifico';
    return cb(new Error('error especifico'), false);
  }
  // Validation for upload

  cb(null, true);
};
