const User = require('../models/user');

exports.isAdmin = async (req, res, next) => {
  req.user = null;
  if (req.session) {
    const { userId } = req.session;
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          req.user = user;
          if (user.admin) {
            return next();
          }
          return res.status(400).send('No estas autorizado');
        }
        return res.status(500).send('Error desconocido');
      } catch (error) {
        console.log(error);
        return res.status(500).send('Error desconocido');
      }
    }
    return res.status(400).send('No estas logeado');
  }
  return res.status(500).send('Error desconocido');
};
