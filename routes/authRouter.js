var express = require('express');
var router = express.Router();

const member_controller = require('../controllers/memberController');

// Sign up page
router.get('/sign-up', member_controller.member_signup_get);
router.post('/sign-up', member_controller.member_signup_post);

// Login page
router.get('/log-in', member_controller.member_login_get);
router.post('/log-in', member_controller.member_login_post);

// Member access sign up page
router.get('/member-sign-up', member_controller.member_access_signup_get);
router.post('/member-sign-up', member_controller.member_access_signup_post);

// Create message page
router.get('/create-message', member_controller.create_message_get);
router.post('/create-message', member_controller.create_message_post);

// Admin delete message page
router.post('/delete-message', member_controller.delete_message_post);

router.get('/log-out', member_controller.member_logout_get);

module.exports = router;
