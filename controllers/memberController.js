const Members = require('../models/members');
const passport = require('passport');

// Display list of all Members.

exports.member_signup_get = function (req, res) {
  res.render('sign-up-form', { title: 'Member Sign Up', user: req.user });
};

exports.member_signup_post = function (req, res, next) {
  const user = new Members({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.member_login_get = function (req, res) {
  res.render('log-in', { title: 'Member Log In', user: req.user });
};

exports.member_login_post = passport.authenticate('local', {
  successRedirect: '/test',
  failureRedirect: '/auth/log-in',
});

// app.post(
//   "/log-in",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/"
//   })
// );
