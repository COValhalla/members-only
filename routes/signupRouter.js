var express = require('express');
var router = express.Router();

const member_controller = require('../controllers/memberController');

/* GET sign-up page. */
router.get('/', member_controller.member_create_get);
router.post('/sign-up', member_controller.member_create_post);

module.exports = router;
