const mongoose = require('mongoose');
const { gridFsBucketName } = require('../lib/constants');

const gfsMid = async (req, _res, next) => {
  const conn = mongoose.connection;
  const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: gridFsBucketName,
  });

  req.gfs = gfs;
  return next();
};

exports.gfsMid = gfsMid;
