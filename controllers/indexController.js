const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.getIndex = function (req, res, next) {
  res.render('index', {
    title: 'Members Only',
    user: req.user,
    message: req.flash('error'),
  });
};

exports.getSignUp = function (req, res, next) {
  res.render('sign_up', { title: 'Sign Up', errors: null });
};

exports.postSignUp = [
  body('username', 'Invalid username').escape().trim(),
  body('password', 'Invalid username').trim().isLength({ min: 6 }),
  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('sign_up', { title: 'Sign Up', errors: errors.array() });
    }
    User.find({ username: req.body.username }).then((user) => {
      console.log(user);
      if (user.length > 0) {
        res.render('sign_up', {
          title: 'Sign Up',
          errors: [{ msg: 'Already user with that username' }],
        });
      } else {
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
      }
    });
  },
];

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
