const UserDue = require('../models/userDue');
const Due = require('../models/dues');

exports.fileFilter = async (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.errorFileFilter = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  const { userDueName } = req.body;
  if (!userDueName) {
    req.errorFileFilter = 'No hay nombre de cuota';
    return cb(new Error('error especifico'), false);
  }
  if (!(typeof userDueName === 'string')) {
    req.errorFileFilter = 'No es un string el nombre de cuota';
    return cb(new Error('error especifico'), false);
  }
  const { user } = req;
  if (!user) {
    req.errorFileFilter = 'No estas autenticado';
    return cb(new Error('error especifico'), false);
  }
  try {
    const due = await Due.findOne({ name: userDueName }).exec();
    if (!due) {
      req.errorFileFilter = 'No se encontro la cuota';
      return cb(new Error('error especifico'), false);
    }

    const userDue = await UserDue.findOne({
      user: user._id,
      due: due._id,
    }).exec();

    if (!userDue) {
      req.errorFileFilter = 'No se encontró la cuota especifica';
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
