const Members = require('../models/members');

// Display list of all Members.

exports.member_create_get = function (req, res) {
  res.render('sign-up-form', { title: 'Sign Up' });
};

exports.member_create_post = function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
