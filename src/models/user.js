const mongoose = require('mongoose');

const { model, Schema } = mongoose;
const createUserDuesWhenUserCreated = require('./middleware/createUserDues');

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  dni: {
    type: String,
    unique: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
});
userSchema.post('save', createUserDuesWhenUserCreated);
userSchema.post('insertMany', createUserDuesWhenUserCreated);
const User = model('User', userSchema);
module.exports = User;
