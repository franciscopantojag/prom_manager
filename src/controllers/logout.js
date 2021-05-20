exports.logout = (req, res) => {
  if (req.user) {
    return req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Hubo un error de servidor' });
      }
      res.clearCookie('qid');
      return res.redirect('/');
    });
  }
  return res.redirect('/login');
};
