var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page. */

router.get('/', indexController.getIndex);

router.get('/sign-up', indexController.getSignUp);

router.post('/sign-up', indexController.postSignUp);

router.get('/success', indexController.getSuccessPage);

router.get('/log-in', indexController.getLogIn);

router.post('/log-in', indexController.postLogIn);

router.get('/log-out', indexController.getLogOut);

router.get('/new-post', indexController.getMessageForm);

router.post('/new-post', indexController.postMessageForm);

router.get('/membership', indexController.getMembershipPage);

router.get('/enable-membership', indexController.getMemberForm);

router.post('/enable-membership', indexController.postMemberForm);

router.get('/member-success', indexController.getMemberSuccess);

router.get('/enable-admin', indexController.getAdminForm);

router.post('/enable-admin', indexController.postAdminForm);

router.get('/admin-success', indexController.getAdminSuccess);

module.exports = router;
