const xss = require('xss');
const mongoose = require('mongoose');
const Due = require('../models/dues');

const myxss = new xss.FilterXSS({
  whiteList: {},
});
exports.editDue = async (req, res) => {
  const { dueId } = req.params;
  if (!dueId) {
    return res.status(500);
  }
  if (!mongoose.Types.ObjectId.isValid(dueId)) {
    return res.status(400).send('Invalid Object Id');
  }
  const errors = [];
  let { dueName, dueTotal, dueFechaLimite, dueAll } = req.body;
  const stringValues = [dueName, dueTotal, dueFechaLimite];
  const allString = stringValues.every((str) => typeof str === 'string');
  if (!allString) {
    return res.status(400).send('bad request');
  }
  dueName = myxss.process(dueName);
  dueTotal = myxss.process(dueTotal);
  dueFechaLimite = myxss.process(dueFechaLimite);
  if (dueName.trim() === '') {
    errors.push({
      key: 'dueName',
      msg: "Cant'be blank",
    });
  } else if (dueName.length <= 3) {
    errors.push({
      key: 'dueName',
      msg: 'Must be at least 3 characters',
    });
  }
  if (dueTotal.trim() === '') {
    errors.push({
      key: 'dueTotal',
      msg: "Cant'be blank",
    });
  }
  if (dueFechaLimite.trim() === '') {
    errors.push({
      key: 'dueFechaLimite',
      msg: "Cant'be blank",
    });
  }
  if (errors.length > 0) {
    res.cookie('createDueErrors', errors);
    return res.status(400).redirect('/admin');
  }
  if (Number.isNaN(Date.parse(dueFechaLimite))) {
    return res.status(400).send('bad request');
  }
  if (Number.isNaN(Number(dueTotal))) {
    return res.status(400).send('bad request');
  }
  if (dueAll === 'on') {
    dueAll = true;
  } else {
    dueAll = false;
  }
  dueFechaLimite = new Date(Date.parse(dueFechaLimite));
  dueTotal = Number(dueTotal);
  dueName = dueName.trim();
  let possibleDuplicateDue;
  try {
    possibleDuplicateDue = await Due.findOne({ name: dueName }).exec();
  } catch (err) {
    return res
      .status(500)
      .send('Error tratando de buscar duplicados antes de crear due');
  }
  if (possibleDuplicateDue) {
    if (!(possibleDuplicateDue._id.toString() === dueId)) {
      errors.push({
        key: 'dueName',
        msg: 'There is another due with that name',
      });
      res.cookie('createDueErrors', errors);
      return res.status(400).redirect('/admin');
    }
  }
  try {
    await Due.findByIdAndUpdate(dueId, {
      name: dueName,
      fechaLimite: dueFechaLimite,
      total: dueTotal,
      all: dueAll,
    });
  } catch (error) {
    return res.status(500).send('Error de servidor desconocido');
  }
  return res.redirect('/admin');
};
exports.renderEditDueView = async (req, res) => {
  const { user } = req;
  const { dueId } = req.params;
  if (!dueId) {
    return res.status(500);
  }
  if (!mongoose.Types.ObjectId.isValid(dueId)) {
    return res.status(400).send('Invalid Object Id');
  }
  let due;
  try {
    due = await Due.findById(dueId).exec();
    due = due.toJSON();
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error de servidor');
  }
  if (!due) {
    return res.status(404).send('No se encontró la deuda');
  }
  if (Object.prototype.toString.call(due.fechaLimite) === '[object Date]') {
    const offset = due.fechaLimite.getTimezoneOffset();
    due = {
      ...due,
      customDateObject: {
        date: new Date(due.fechaLimite.getTime() - offset * 60 * 1000),
        str: due.fechaLimite.toISOString().split('T')[0],
      },
    };
  }

  return res.render('due/[id]', { due, user });
};
exports.createDue = async (req, res) => {
  const errors = [];
  let { dueName, dueTotal, dueFechaLimite, dueAll } = req.body;
  const stringValues = [dueName, dueTotal, dueFechaLimite];
  const allString = stringValues.every((str) => typeof str === 'string');
  if (!allString) {
    return res.status(400).send('bad request');
  }
  dueName = myxss.process(dueName);
  dueTotal = myxss.process(dueTotal);
  dueFechaLimite = myxss.process(dueFechaLimite);
  if (dueName.trim() === '') {
    errors.push({
      key: 'dueName',
      msg: "Cant'be blank",
    });
  } else if (dueName.length <= 3) {
    errors.push({
      key: 'dueName',
      msg: 'Must be at least 3 characters',
    });
  }
  if (dueTotal.trim() === '') {
    errors.push({
      key: 'dueTotal',
      msg: "Cant'be blank",
    });
  }
  if (dueFechaLimite.trim() === '') {
    errors.push({
      key: 'dueFechaLimite',
      msg: "Cant'be blank",
    });
  }
  if (errors.length > 0) {
    res.cookie('createDueErrors', errors);
    return res.status(400).redirect('/admin');
  }
  if (Number.isNaN(Date.parse(dueFechaLimite))) {
    return res.status(400).send('bad request');
  }
  if (Number.isNaN(Number(dueTotal))) {
    return res.status(400).send('bad request');
  }
  if (dueAll === 'on') {
    dueAll = true;
  } else {
    dueAll = false;
  }
  dueFechaLimite = new Date(Date.parse(dueFechaLimite));
  dueTotal = Number(dueTotal);
  if (dueTotal < 0) {
    errors.push({
      key: 'dueTotal',
      msg: 'El total de la cuota debe ser mayor a 0',
    });
    res.cookie('createDueErrors', errors);
    return res.status(400).redirect('/admin');
  }
  dueName = dueName.trim();
  let possibleDuplicateDue;
  try {
    possibleDuplicateDue = await Due.findOne({ name: dueName }).exec();
  } catch (err) {
    return res
      .status(500)
      .send('Error tratando de buscar duplicados antes de crear due');
  }
  if (possibleDuplicateDue) {
    errors.push({
      key: 'dueName',
      msg: 'There is another due with that name',
    });
    res.cookie('createDueErrors', errors);
    return res.status(400).redirect('/admin');
  }

  try {
    await Due.create({
      name: dueName,
      fechaLimite: dueFechaLimite,
      total: dueTotal,
      all: dueAll,
    });
  } catch (error) {
    return res.status(500).send('Error de servidor desconocido');
  }

  return res.redirect('/admin');
};
