const Members = require('../models/members');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passwordValidator = require('password-validator');
const dotenv = require('dotenv').config();

// Password validator
const schema = new passwordValidator();
schema.is().min(4).is().max(24).has().not().spaces();

// Display list of all Members.

exports.member_signup_get = function (req, res) {
  res.render('sign-up-form', {
    title: 'Member Sign Up',
    user: req.user,
    errors: { main: [], member: [] },
  });
};

exports.member_signup_post = [
  body('password', 'Password must be between 4 and 24 characters.')
    .trim()
    .isLength({ min: 4, max: 24 })
    .escape(),
  body('confPassword', 'Passwords do not match.').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match.');
    }
    return true;
  }),
  body('memberPassword', 'Incorrect member password.').custom((value) => {
    if (
      value === process.env.memberPassword ||
      value === process.env.adminPassword
    ) {
      return true;
    } else {
      return false;
    }
  }),

  function (req, res, next) {
    const errors = validationResult(req);
    const parsedErrors = { main: [], member: [] };
    errors.array().forEach((error) => {
      if (error.param === 'memberPassword') {
        parsedErrors.member.push(error.msg);
      } else {
        parsedErrors.main.push(error.msg);
      }
    });

    // Render form with validation errors
    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        title: 'Member Sign Up',
        user: req.user,
        errors: parsedErrors,
      });
      return;
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
        status: 'member',
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
