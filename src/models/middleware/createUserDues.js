/* eslint-disable global-require */
const createUserDuesWhenUserCreated = async (data, next) => {
  const Due = require('../dues');
  const UserDue = require('../userDue');
  if (Array.isArray(data)) {
    // we are in bulk
    const duesForAllUsers = await Due.find({ all: true }).exec();
    let userDuesToInsert = [];
    data.forEach((user) => {
      const userDuesForThisUser = duesForAllUsers.map((due) => ({
        due: due._id,
        user: user._id,
      }));
      userDuesToInsert = [...userDuesForThisUser, ...userDuesToInsert];
    });
    try {
      await UserDue.insertMany(userDuesToInsert);
    } catch (err) {
      console.log(err);
    }
    next();
  } else {
    let duesForAllUsers;
    try {
      duesForAllUsers = await Due.find({ all: true }).exec();
    } catch (err) {
      console.log(err);
      throw new Error(
        'Error al encontrar las cuotas que se asignan a todos los usuarios'
      );
    }

    const userDuesToInsert = duesForAllUsers.map((due) => ({
      due: due._id,
      user: data._id,
    }));
    try {
      await UserDue.insertMany(userDuesToInsert);
    } catch (err) {
      console.log(err);
      throw new Error(
        'Error al crear las cuotas para el usuario recien creado'
      );
    }
    next();
  }
};

module.exports = createUserDuesWhenUserCreated;
