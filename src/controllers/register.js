const bcrypt = require('bcrypt');
const xss = require('xss');
const User = require('../models/user');

const myxss = new xss.FilterXSS({
  whiteList: {},
});

const registerUser = async (req, res) => {
  const keys = ['firstName', 'lastName', 'email', 'password', 'dni'];
  const reqKeys = Object.keys(req.body);

  const includedAll = reqKeys.every((a) => keys.includes(a));
  if (!includedAll) {
    return res.status(400).send('Bad request');
  }
  const { firstName, lastName, email, password, dni } = req.body;
  const values = [firstName, lastName, email, password, dni];
  const allString = values.every((a) => typeof a === 'string');
  if (!allString) {
    return res.status(400).send('Bad request');
  }
  // from website
  const errors = {};
  if (firstName.trim() === '') {
    errors.firstName = 'Por favor ingrese su nombre';
  } else if (firstName.length <= 3) {
    errors.firstName = 'El nombre debe tener más de tres caracteres';
  }

  if (lastName.trim() === '') {
    errors.lastName = 'Por favor ingrese su apellido';
  } else if (lastName.length <= 3) {
    errors.lastName = 'El apellido debe tener más de tres caracteres';
  }
  if (email.trim() === '') {
    errors.email = 'Por favor ingrese su email';
  } else if (email.length <= 3) {
    errors.email = 'El email debe tener más de tres caracteres';
  } else {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email.toLowerCase())) {
      errors.email = 'Por favor ingrese un email valido';
    } else {
      const user = await User.findOne({ email });
      if (user) {
        errors.email = 'Este email ya existe';
      }
    }
  }
  if (password.trim() === '') {
    errors.password = 'Por favor ingrese una contraseña';
  } else if (password.length <= 3) {
    errors.password = 'El password debe tener más de tres caracteres';
  }
  if (dni.trim() === '') {
    errors.dni = 'Por favor ingrese su DNI';
  } else if (dni.length <= 3) {
    errors.dni = 'El dni debe tener más de tres caracteres';
  } else {
    const user = await User.findOne({ dni });
    if (user) {
      errors.dni = 'Este dni ya esta registrado';
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: 'not ok', errors: { ...errors } });
  }
  // no errors
  const newPassword = bcrypt.hashSync(password, 8);
  const obj = { firstName, lastName, email, password: newPassword, dni };
  const keysObj = Object.keys(obj);
  keysObj.forEach((key) => {
    // obj[key] = xss(obj[key]);
    obj[key] = myxss.process(obj[key]);
  });
  let user = null;
  try {
    user = await User.create({
      ...obj,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: 'not ok', errors: { user: 'Failed to create user' } });
  }
  if (!user) {
    return res
      .status(500)
      .json({ ok: 'not ok', errors: { user: 'Failed to create user' } });
  }

  req.session.userId = user._id;

  return res.status(200).json({ ok: 'ok' });
};
const renderRegisterView = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  return res.render('register', {
    title: 'Prom Manager - Register',
  });
};
exports.registerUser = registerUser;
exports.renderRegisterView = renderRegisterView;
