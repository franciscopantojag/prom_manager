const mongoose = require('mongoose');
const { gridFsBucketName } = require('../lib/constants');

const { model, Schema } = mongoose;

const gfsSchema = new Schema(
  {},
  {
    strict: false,
  }
);
const GFS = model('GFS', gfsSchema, `${gridFsBucketName}.files`);
module.exports = GFS;
