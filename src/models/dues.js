const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const createUserDuesWhenDueAllCreated = require('./middleware/createUserDuesWhenDueAllCreated');

const dueSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  fechaLimite: {
    type: Date,
    required: true,
    default: new Date(Date.now() + 30 * 24 * 3600 * 1000),
  },
  total: {
    default: 100,
    type: Number,
    required: true,
  },
  all: {
    type: Boolean,
    default: true,
    required: true,
  },
});
dueSchema.post('save', createUserDuesWhenDueAllCreated);

const Due = model('Due', dueSchema);
module.exports = Due;
