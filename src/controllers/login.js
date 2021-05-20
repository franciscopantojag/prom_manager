const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.renderLoginView = (req, res) => {
  // initiate render view
  if (req.user) {
    return res.redirect('/');
  }
  const locals = { title: 'Prom Manager - Login' };
  if (req.cookies) {
    if (req.cookies.login_errors) {
      locals.login_errors = req.cookies.login_errors;
    }
  }
  res.clearCookie('login_errors');
  return res.render('login', locals);
};
exports.loginUser = async (req, res) => {
  const keys = ['email', 'password'];
  const actualKeys = Object.keys(req.body);
  const allKeys = keys.every((a) => actualKeys.includes(a));
  if (!allKeys) {
    return res.status(400).send('bad request');
  }
  const { email, password } = req.body;
  const allString = [email, password].every((a) => typeof a === 'string');
  if (!allString) {
    return res.status(400).send('bad request');
  }
  // secure types and keys
  const errors = {};
  let user;
  try {
    user = await User.findOne({ email }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
  if (!user) {
    errors.email = 'That email is not registered';
    res.cookie('login_errors', errors);
    return res.redirect('/login');
  }
  // the user exists
  const passwordsMatch = bcrypt.compareSync(password, user.password);
  if (!passwordsMatch) {
    errors.password = "Passwords doesn't match";
    res.cookie('login_errors', errors);
    return res.redirect('/login');
  }
  // is authenticated
  req.session.userId = user._id;
  return res.redirect('/');
};
