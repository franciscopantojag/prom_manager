const User = require('../models/user');

module.exports = async (req, _res, next) => {
  req.user = null;
  if (req.session) {
    const { userId } = req.session;
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  next();
};
