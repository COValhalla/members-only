var express = require('express');
var router = express.Router();

/* GET sign-up page. */
router.get('/', function (req, res, next) {
  res.render('sign-up-form', { title: 'Sign-Up' });
});

module.exports = router;
