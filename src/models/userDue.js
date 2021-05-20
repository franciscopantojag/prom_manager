const mongoose = require('mongoose');
const { possibleUserDueStates } = require('../lib/constants');

const { Schema, model } = mongoose;

const userDueSchema = new Schema({
  state: {
    type: String,
    required: true,
    default: 'No pagado',
    enum: possibleUserDueStates,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  due: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Due',
  },
  files: [
    {
      type: Schema.Types.Object,
      ref: 'GFS',
    },
  ],
});
//Esto es un comentario
userDueSchema.index({ user: 1, due: 1 }, { unique: true });
const UserDue = model('UserDue', userDueSchema);
module.exports = UserDue;
