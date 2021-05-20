const Due = require('../models/dues');
const UserDue = require('../models/userDue');
const User = require('../models/user');
const { possibleUserDueStates } = require('../lib/constants');

exports.renderAdminView = async (req, res) => {
  const { createDueErrors } = req.cookies;
  if (createDueErrors) {
    res.clearCookie('createDueErrors');
  }
  const { user } = req;
  let dues = null;
  try {
    dues = await Due.find().exec();
  } catch (err) {
    console.log(err);
  }
  let userDues;
  try {
    userDues = await UserDue.find()
      .populate({ path: 'user', select: 'firstName lastName dni' })
      .populate({ path: 'due', select: 'name total fechaLimite' })
      .populate({ path: 'files' })
      .exec();
  } catch (err) {
    console.log(err);
  }
  let users;
  try {
    users = await User.find().exec();
  } catch (err) {
    console.log(err);
  }
  if (Array.isArray(users) && Array.isArray(userDues)) {
    if (users.length > 0 && userDues.length > 0) {
      users = users.map((allUser) => allUser.toJSON());
      userDues = userDues.map((userDue) => userDue.toJSON());
      users = users.map((allUser) => ({
        ...allUser,
        userDues: [
          ...userDues.filter((userDue) => {
            if (userDue.user) {
              const isIncluded =
                userDue.user._id.toString() === allUser._id.toString();
              return isIncluded;
            }
            return false;
          }),
        ],
      }));
      if (Array.isArray(dues)) {
        const allDuesIds = dues.map((due) => due._id.toString());
        users = users.map((allUser) => {
          const newAllUser = { ...allUser };
          if (allUser.userDues) {
            const duesIdsForThisUser = allUser.userDues.map((userDue) =>
              userDue.due._id.toString()
            );
            const duesIdsNotIncludedForThisUser = allDuesIds.filter(
              (dueId) => !duesIdsForThisUser.includes(dueId)
            );
            const duesNotIncludedForThisUser = dues.filter((due) =>
              duesIdsNotIncludedForThisUser.includes(due._id.toString())
            );
            newAllUser.duesNotIncludedForThisUser = duesNotIncludedForThisUser;
          }

          return newAllUser;
        });
      }
    }
  }

  const locals = {
    title: 'Prom Manager - Admin',
    user,
    dues,
    userDues,
    users,
    view: 'admin',
    createDueErrors,
    possibleUserDueStates,
  };
  return res.render('admin', locals);
};
