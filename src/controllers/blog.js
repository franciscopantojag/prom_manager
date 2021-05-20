exports.renderBlogView = (req, res) => {
  const locals = {
    title: 'Prom Manager - Blog',
  };
  if (!req.user) {
    return res.redirect('/login');
  }
  locals.user = req.user;

  return res.render('blog', locals);
};
