const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.getIndex = function (req, res, next) {
  res.render('index', {
    title: 'Members Only',
    user: req.user,
    message: req.flash('error'),
  });
};

exports.getSignUp = function (req, res, next) {
  res.render('sign_up', { title: 'Sign Up' });
};

exports.postSignUp = function (req, res, next) {
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
};

exports.getLogIn = function (req, res, next) {
  res.render('log_in', {
    title: 'Log in',
    user: req.user,
    message: req.flash('error'),
  });
};

exports.postLogIn = function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true,
  })(req, res, next);
};

exports.getLogOut = function (req, res) {
  req.logout();
  res.redirect('/');
};
