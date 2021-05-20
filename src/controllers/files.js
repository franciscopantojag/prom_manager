const multer = require('multer');
const { fileFilter } = require('../lib/fileFilter');
const UserDue = require('../models/userDue');

exports.uploadUserDue = (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(400).send('No estas autenticado');
  }
  if (!req.gridFsStorage) {
    return res.status(500).send('Error de servidor');
  }
  const storage = req.gridFsStorage;
  let upload = null;
  try {
    upload = multer({ storage, fileFilter }).single('file');
    if (!upload) {
      return res.status(500).send('Error de servidor');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error de servidor');
  }

  return upload(req, res, async (err) => {
    if (req.errorFileFilter) {
      return res.send(req.errorFileFilter);
    }
    if (err) {
      console.log(err);
      return res.send(err);
    }
    if (!req.file) {
      return res.status(400).send('no hay file');
    }
    if (!req.userDue) {
      return res.send('Hubo un error desconocido');
    }

    try {
      const objUpdate = {
        $push: {
          files: [req.file.id],
        },
      };
      if (req.userDue.files.length === 0) {
        objUpdate.$set = {
          state: 'En proceso',
        };
      }
      const userDue = await UserDue.findByIdAndUpdate(
        req.userDue._id,
        objUpdate,
        {
          new: true,
        }
      ).exec();
      if (!userDue) {
        return res.status(500).send('error de servidor desconocido');
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send('error de servidor al actualizar cuota con el nuevo archivo');
    }
    return res.redirect('/');
  });
};

exports.sendSingleFile = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.redirect('/login');
  }
  const { filename } = req.params;
  const { gfs } = req;
  if (filename && gfs) {
    return gfs.find({ filename }).toArray(async function (err, files) {
      if (err) {
        return res.status(404).json({ err: 'error' });
      }
      if (!files || files.length === 0) {
        return res.status(404).json({ err: 'No file found' });
      }
      const singleFile = files[0];
      const readstream = gfs.openDownloadStream(singleFile._id);
      if (user.admin === true) {
        return readstream.pipe(res);
      }
      let userDues = null;
      try {
        userDues = await UserDue.find({ user: user._id })
          .populate({ path: 'files' })
          .exec();
        if (!Array.isArray(userDues)) {
          return res.send('Hubo un error de db');
        }
        if (userDues.length <= 0) {
          return res.status(404).send('No tienes ninguna cuota asignada');
        }
      } catch (error) {
        return res.send('Hubo un error al verificar el archivo');
      }

      if (!userDues) {
        return res.send('Hubo un error desconocido');
      }
      const myFiles = userDues
        .map((userDue) => userDue.toJSON())
        .map((userDue) => userDue.files.map((file) => file.filename))
        .flat();

      if (myFiles.length <= 0) {
        return res
          .status(404)
          .send('No hay archivos para ninguna cuota de este usuario');
      }
      if (!myFiles.includes(filename)) {
        return res.status(400).send('No estas autorizado a ver este archivo');
      }
      // everything ok

      return readstream.pipe(res);
    });
  }
  return res.status(500).send('error de servidor');
};
