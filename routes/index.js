var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

/* GET home page. */

router.get('/', indexController.getIndex);

router.get('/sign-up', indexController.getSignUp);

router.post('/sign-up', indexController.postSignUp);

router.get('/log-in', indexController.getLogIn);

router.post('/log-in', indexController.postLogIn);

router.get('/log-out', indexController.getLogOut);

router.get('/new-post', indexController.getMessageForm);

router.post('/new-post', indexController.postMessageForm);

module.exports = router;
