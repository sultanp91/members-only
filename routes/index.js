var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/sign-up', function (req, res, next) {
  res.render('sign_up', { title: 'Sign Up' });
});

router.post('/sign-up', (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
});

router.post('/log-in', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  });
});

// router.post('/log-in', passport.authenticate('local'), (req, res, next) => {
//   if (req.user) {
//     res.redirect('/');
//   } else {
//     res.redirect('/failure');
//   }
// });

module.exports = router;
