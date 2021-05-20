const Due = require('../models/dues');

const createDues = async () => {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const currentYear = new Date().getFullYear();
  const duesToInsert = months.map((month) => ({
    name: `${month}${currentYear}`,
  }));
  try {
    const dues = await Due.insertMany(duesToInsert);
    console.log(dues);
  } catch (err) {
    console.log('Error al crear cuotas');
  }
};

exports.createDues = createDues;
