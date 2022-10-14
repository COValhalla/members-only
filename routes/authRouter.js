var express = require('express');
var router = express.Router();

const member_controller = require('../controllers/memberController');

/* GET/POST sign-up page. */
router.get('/sign-up', member_controller.member_signup_get);
router.post('/sign-up', member_controller.member_signup_post);

// GET/POST login page
router.get('/log-in', member_controller.member_login_get);
router.post('/log-in', member_controller.member_login_post);

// GET/POST member sign-up page
router.get('/member-sign-up', member_controller.member_access_signup_get);
router.post('/member-sign-up', member_controller.member_access_signup_post);

// GET/POST admin sign-up page
router.get('/admin-sign-up', member_controller.admin_access_signup_get);
router.post('/admin-sign-up', member_controller.admin_access_signup_post);

router.get('/log-out', member_controller.member_logout_get);

module.exports = router;
