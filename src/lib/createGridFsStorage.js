require('dotenv').config();
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');

const { gridFsBucketName } = require('../lib/constants');

exports.createGridFsStorage = (mongooseConnection = mongoose.connection) => {
  const gridFsStorage = new GridFsStorage({
    db: mongooseConnection,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        return crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename =
            buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: gridFsBucketName,
          };
          resolve(fileInfo);
        });
      });
    },
  });
  return gridFsStorage;
};
