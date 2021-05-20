/* eslint-disable global-require */
const createUserDuesWhenDueAllCreated = async (data, next) => {
  const UserDue = require('../userDue');
  const User = require('../user');
  if (Array.isArray(data)) {
    const duesAll = data.filter((due) => due.all === true);
    if (duesAll.length > 0) {
      let allUsers;
      try {
        allUsers = await User.find({}).exec();
      } catch (err) {
        console.log(err);
      }
      if (Array.isArray(allUsers)) {
        if (allUsers.length > 0) {
          let userDuesToInsert = [];
          allUsers.forEach((allUser) => {
            const duesAllForThisUser = duesAll.map((dueAll) => ({
              due: dueAll._id,
              user: allUser._id,
            }));
            userDuesToInsert = [...userDuesToInsert, ...duesAllForThisUser];
          });
          if (userDuesToInsert.length > 0) {
            try {
              await UserDue.insertMany(userDuesToInsert);
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    }
    next();
  } else if (data) {
    if (data.all === true) {
      let allUsers;
      try {
        allUsers = await User.find({}).exec();
      } catch (err) {
        console.log(err);
      }
      if (Array.isArray(allUsers)) {
        if (allUsers.length > 0) {
          try {
            const userDuesToInsert = allUsers.map((user) => ({
              user: user._id,
              due: data._id,
            }));
            await UserDue.insertMany(userDuesToInsert);
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
    next();
  }
};
module.exports = createUserDuesWhenDueAllCreated;
