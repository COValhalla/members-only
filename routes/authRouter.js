var express = require('express');
var router = express.Router();

const member_controller = require('../controllers/memberController');

/* GET log-in page. */
router.get('/sign-up', member_controller.member_signup_get);
router.post('/sign-up', member_controller.member_signup_post);

// Get sign-up page
router.get('/log-in', member_controller.member_login_get);
router.post('/log-in', member_controller.member_login_post);

router.get('/log-out', member_controller.member_logout_get);

module.exports = router;
