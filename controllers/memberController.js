const Members = require('../models/members');
const Messages = require('../models/messages');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passwordValidator = require('password-validator');
const dotenv = require('dotenv').config();

// Password validator
const schema = new passwordValidator();
schema.is().min(4).is().max(24).has().not().spaces();

exports.home_get = function (req, res, next) {
  Messages.find()
    .populate('author')
    .sort({ date: -1 })
    .exec(function (err, messages) {
      if (err) {
        return next(err);
      }
      res.render('index', {
        title: 'Home',
        messages: messages,
      });
    });
};

exports.member_signup_get = function (req, res) {
  res.render('sign-up-form', {
    title: 'Members-Only Sign Up',
    errors: { main: [], member: [] },
  });
};

exports.member_signup_post = [
  body('username', 'Username must be between 4 and 24 characters.')
    .trim()
    .isLength({ min: 4, max: 24 })
    .toLowerCase()
    .escape(),
  body('password', 'Password must be between 4 and 24 characters.')
    .trim()
    .isLength({ min: 4, max: 24 })
    .escape(),
  body('confPassword', 'Passwords do not match.').custom((value, { req }) => {
    if (value !== req.body.password) {
      return false;
    }
    return true;
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
        title: 'Members-Only Sign Up',
        user: req.body.username,
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
          title: 'Members-Only Sign Up',

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
        status: 'guest',
      }).save((err) => {
        if (err) {
          return next(err);
        }
        // Authenticates newly created user
        passport.authenticate('local', function (err, user, info) {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.redirect('/sign-up');
          }
          req.logIn(user, function (err) {
            if (err) {
              return next(err);
            }
            return res.redirect('/');
          });
        })(req, res, next);
      });
    });
  },
];

exports.member_login_get = function (req, res) {
  res.render('log-in', {
    title: 'Member Log In',
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
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    }
    return;
  })(req, res, next);
};

exports.member_access_signup_get = function (req, res) {
  res.render('member-sign-up-form', {
    title: 'Member Access Sign Up',
    errors: [{ msg: '' }],
  });
};
exports.member_access_signup_post = function (req, res) {
  if (
    req.body.memberPassword === process.env.MEMBER_PASSWORD &&
    req.user.status !== 'member'
  ) {
    Members.findOneAndUpdate(
      { username: req.user.username },
      { status: 'member' },
      function (err, member) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      },
    );
  } else if (req.body.memberPassword === process.env.ADMIN_PASSWORD) {
    Members.findOneAndUpdate(
      { username: req.user.username },
      { status: 'admin' },
      function (err, member) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      },
    );
  } else {
    const status = req.user.status;
    let error = null;
    if (status === 'member') {
      error = [{ msg: 'Incorrect admin password.' }];
    } else {
      error = [{ msg: 'Incorrect member password.' }];
    }

    res.render('member-sign-up-form', {
      title: 'Member Access Sign Up',
      errors: error,
    });
  }
};

exports.create_message_get = function (req, res) {
  res.render('create-message-form', { title: 'Create Message', errors: [] });
};
exports.create_message_post = [
  body('title', 'Title must be between 4 and 24 characters.')
    .trim()
    .isLength({ min: 4, max: 24 })
    .escape(),
  body('message', 'Message must be between 1 and 200 characters.')
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('create-message-form', {
        title: 'Create Message',
        errors: errors.array(),
      });
      return;
    }
    const message = new Messages({
      title: req.body.title,
      message: req.body.message,
      author: req.user._id,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
];

exports.member_logout_get = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
