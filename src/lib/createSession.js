const session = require('express-session');
// const MongoDbStore = require('connect-mongodb-session')(session);
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
require('dotenv').config();

const createSession = (mongooseConnection = mongoose.connection) => {
  const store = new MongoStore({
    mongooseConnection,
  });
  return session({
    name: 'qid',
    store,
    cookie: {
      maxAge: 1000 * 3600 * 24 * 365 * 10,
      httpOnly: true,
      sameSite: 'lax',
    },
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  });
};
module.exports = createSession;
