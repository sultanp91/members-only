var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Members Only',
    user: req.user,
    message: req.flash('error'),
  });
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

router.get('/log-in', function (req, res, next) {
  res.render('log_in', {
    title: 'Log in',
    user: req.user,
    message: req.flash('error'),
  });
});

router.post('/log-in', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true,
  })(req, res, next);
});

router.get('/log-out', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
