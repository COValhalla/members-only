const Members = require('../models/members');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passwordValidator = require('password-validator');

// Password validator
const schema = new passwordValidator();
schema.is().min(4).is().max(24).has().not().spaces();

// Display list of all Members.

exports.member_signup_get = function (req, res) {
  res.render('sign-up-form', {
    title: 'Member Sign Up',
    user: req.user,
    errors: null,
  });
};

exports.member_signup_post = [
  body('password', 'Password must be between 4 and 24 characters.')
    .trim()
    .isLength({ min: 4, max: 24 })
    .escape(),
  function (req, res, next) {
    const errors = validationResult(req);
    // Password validation
    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        title: 'Member Sign Up',
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else if (req.body.password !== req.body.confPassword) {
      const errors = [{ msg: 'Passwords do not match.' }];
      res.render('sign-up-form', {
        title: 'Member Sign Up',
        user: req.user,
        errors: errors,
      });
    }

    // Confirm unique username
    Members.findOne({ username: req.body.username }).exec(function (
      err,
      found_member,
    ) {
      if (err) {
        return next(err);
      }
      if (found_member) {
        res.render('sign-up-form', {
          title: 'Member Sign Up',
          user: req.user,
          errors: [{ msg: 'Username already exists.' }],
        });
        return;
      }
    });

    // Data from form is valid.
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new Members({
        username: req.body.username,
        password: hashedPassword,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  },
];

exports.member_login_get = function (req, res) {
  res.render('log-in', {
    title: 'Member Log In',
    user: req.user,
    message: null,
  });
};

exports.member_login_post = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render('log-in', {
        title: 'Member Log In',
        user: user.username,
        message: info.message,
      });
      return;
    }
    if (res) {
      res.render('./', {
        title: 'Home',
        user: user.username,
      });
    }
    return;
  })(req, res, next);
};

exports.member_logout_get = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
