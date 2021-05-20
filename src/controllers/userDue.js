const mongoose = require('mongoose');
const multer = require('multer');
const UserDue = require('../models/userDue');
const { possibleUserDueStates } = require('../lib/constants');
const { fileFilter } = require('../lib/fileFilterForUploadFileForUserDue');

const { ObjectId } = mongoose.Types;
exports.uploadFileForUserDue = async (req, res) => {
  const { userDueId } = req.params;
  if (typeof userDueId !== 'string') {
    return res.status(400).send('Invalid Request');
  }
  if (!ObjectId.isValid(userDueId)) {
    return res.status(400).send('No es un id valido');
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
    return res.redirect(`/userDue/${userDueId}`);
  });
};
exports.deleteFileForUserDue = async (req, res, next) => {
  const { gfs } = req;
  if (!gfs) {
    return res.status(500).send('Error de servidor');
  }
  const { userDueId } = req.params;
  if (!ObjectId.isValid(userDueId)) {
    return res.status(400).send('No es un id valido');
  }
  const { fileId } = req.params;
  if (!ObjectId.isValid(fileId)) {
    return res.status(400).send('No es un id valido');
  }
  const fileIdObject = new mongoose.mongo.ObjectId(fileId);
  let filesForThisUserDue = [];
  try {
    const thisUserDue = await UserDue.findById(userDueId).exec();
    filesForThisUserDue = thisUserDue.files.map((file) => file.toString());
  } catch (error) {
    return res.status(500).send('Error de servidor');
  }
  if (!filesForThisUserDue.includes(fileId)) {
    return res.status(400).send('Bad request');
  }
  try {
    await UserDue.findByIdAndUpdate(userDueId, {
      $pull: {
        files: fileIdObject,
      },
    });
  } catch (error) {
    return res.status(500).send('Error de servidor');
  }
  return gfs.delete(fileIdObject, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error de servidor');
    }
    return res.redirect(`/userDue/${userDueId}`);
  });
};
exports.deleteUserDue = async (req, res, next) => {
  const { gfs } = req;
  if (!gfs) {
    return res.status(500).send('Error de servidor');
  }
  const { userDueId } = req.params;
  if (!ObjectId.isValid(userDueId)) {
    return res.status(400).send('No es un id valido');
  }
  let userDue;
  try {
    userDue = await UserDue.findByIdAndRemove(userDueId).exec();
  } catch (err) {
    return res.status(500).send('Error de servidor');
  }
  if (!userDue) {
    return res.status(500).send('Error de servidor');
  }
  if (Array.isArray(userDue.files)) {
    if (userDue.files.length > 0) {
      const filesToDelete = userDue.files;
      if (filesToDelete.length > 0) {
        filesToDelete.forEach((file) => {
          gfs.delete(file, (err) => {
            if (err) {
              console.log(`Error al eliminar el file con id: ${file}`);
            } else {
              console.log(`File eliminado: ${file}`);
            }
          });
        });
      }
    }
  }

  return res.redirect(`/userDue/${userDueId}`);
};
exports.createUserDue = async (req, res) => {
  const { userId, dueId, userDueState } = req.body;
  if (![userId, dueId, userDueState].every((str) => typeof str)) {
    return res.status(400).send('Bad request');
  }
  if (
    ![userId, dueId].every((objId) => mongoose.Types.ObjectId.isValid(objId))
  ) {
    return res.status(400).send('Bad request');
  }
  if (!possibleUserDueStates.includes(userDueState)) {
    return res.status(400).send('Bad request');
  }
  try {
    await UserDue.create({
      user: userId,
      due: dueId,
      state: userDueState,
    });
  } catch (error) {
    return res.status(500).send('Error de servidor');
  }
  return res.redirect('/admin');
};
exports.editUserDue = async (req, res, next) => {
  const { userDueId } = req.params;
  if (!ObjectId.isValid(userDueId)) {
    return res.status(400).send('No es un id valido');
  }
  const { userDueState } = req.body;
  if (!(typeof userDueState === 'string')) {
    return res.status(400).send('Bad request');
  }
  try {
    await UserDue.findByIdAndUpdate(userDueId, { state: userDueState });
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/userDue/${userDueId}`);
};
exports.renderUserDueEditView = async (req, res, next) => {
  const { user } = req;

  const { userDueId } = req.params;
  if (!ObjectId.isValid(userDueId)) {
    return res.status(400).send('No es un id valido');
  }
  let userDue;
  try {
    userDue = await UserDue.findById(userDueId)
      .populate('due')
      .populate('user')
      .exec();
  } catch (err) {
    console.log(err);
  }
  return res.render('userdue/[id]', { userDue, user, possibleUserDueStates });
};
