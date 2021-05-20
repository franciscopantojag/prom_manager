require('dotenv').config();
// imports
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const createSession = require('./lib/createSession');
const connectMongo = require('./lib/connectMongo');
// eslint-disable-next-line
const GFS = require('./models/gfs');
//routes
const login = require('./routes/login');
const register = require('./routes/register');
const blog = require('./routes/blog');
const index = require('./routes');
const admin = require('./routes/admin');
const logout = require('./routes/logout');
const files = require('./routes/files');
const due = require('./routes/due');
const userDue = require('./routes/userDue');

const { createDues } = require('./scripts/createDues');

/*constants*/
const PORT = process.env.PORT || 4000;
const viewsDirectory = path.join(__dirname, 'views');
const publicDirectory = path.join(__dirname, '..', 'public');

const main = async () => {
  const response = await connectMongo();
  if (!response.success) {
    return;
  }
  const app = express();
  createDues();
  app.use(methodOverride('_method'));
  app.use(createSession());
  app.use(cookieParser());
  app.set('view engine', 'ejs');
  app.set('layout', path.join(viewsDirectory, 'layouts', 'layout'));
  app.set('views', viewsDirectory);
  app.use(expressLayouts);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(mongoSanitize());
  app.use(express.static(publicDirectory));
  // Views and API
  app.use('/', index);
  app.use('/login', login);
  app.use('/register', register);
  app.use('/blog', blog);
  app.use('/admin', admin);
  app.use('/logout', logout);
  app.use('/files', files);
  app.use('/userDue', userDue);
  app.use('/due', due);

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
main();
