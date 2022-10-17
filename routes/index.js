var express = require('express');
var router = express.Router();
var member_controller = require('../controllers/memberController');

/* GET home page. */
router.get('/', member_controller.home_get);

module.exports = router;
