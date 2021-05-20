const UserDue = require('../models/userDue');

exports.renderIndexView = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  let locals = {
    title: 'Prom Manager - Home',
  };
  const { user } = req;
  locals.user = user;
  try {
    const userDues = await UserDue.find({
      user: user._id,
    })
      .populate({ path: 'user', select: 'firstName lastName dni' })
      .populate({ path: 'due', select: 'name total fechaLimite' })
      .populate({ path: 'files' })
      .exec();
    if (Array.isArray(userDues)) {
      if (userDues.length > 0) {
        locals.userDues = userDues.map((userDue) => ({ ...userDue.toJSON() }));
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error de servidor');
  }
  let uploadButtonEnabled = true;
  let indexSelected = 0;
  let finalUserDues = [];
  if (Array.isArray(locals.userDues)) {
    if (locals.userDues.length > 0) {
      finalUserDues = locals.userDues.filter(
        (userDue) => !(userDue.state === 'Pagado') && userDue.files.length < 3
      );
      if (finalUserDues.length <= 0) {
        uploadButtonEnabled = false;
      } else {
        const test = finalUserDues.map((userDue, index) => [
          index,
          userDue.files.length,
        ]);
        test.sort((arr1, arr2) => arr1[1] - arr2[1]);
        indexSelected = test[0][0];
      }
    }
  }
  locals = { ...locals, indexSelected, finalUserDues, uploadButtonEnabled };
  return res.render('index', locals);
};
