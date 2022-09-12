const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const e = require('connect-flash');

exports.getIndex = function (req, res, next) {
  Post.find({})
    .populate('author')
    .then((posts) => {
      res.render('index', {
        title: 'Members Only',
        user: req.user,
        message: req.flash('error'),
        posts: posts,
      });
    });
};

exports.getSignUp = function (req, res, next) {
  res.render('sign_up', { title: 'Sign Up', user: req.user, errors: null });
};

exports.postSignUp = [
  body(
    'username',
    'Invalid username - usernames must only contain letters and numbers'
  )
    .escape()
    .isAlphanumeric('en-GB')
    .trim(),
  body('password', 'Invalid password').trim().isLength({ min: 6 }),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('sign_up', {
        title: 'Sign Up',
        errors: errors.array(),
        user: req.user,
      });
    }
    User.find({ username: req.body.username }).then((user) => {
      console.log(user);
      if (user.length > 0) {
        res.render('sign_up', {
          title: 'Sign Up',
          errors: [{ msg: 'Already user with that username' }],
          user: req.user,
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
            res.redirect('/success');
          });
        });
      }
    });
  },
];

exports.getSuccessPage = function (req, res, next) {
  res.render('register_success', {
    title: 'Success',
    user: req.user,
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

exports.getMessageForm = function (req, res, next) {
  if (req.user) {
    res.render('new_post_form', {
      title: 'Make New Post',
      errors: null,
      formTitle: '',
      content: '',
      user: req.user,
    });
  } else {
    res.render('forbidden_page', { title: 'Members only', user: null });
  }
};

exports.postMessageForm = [
  body('title', 'Invalid title').escape().trim().isLength({ min: 1 }),
  body('content', 'Too short - please add more coontent')
    .escape()
    .trim()
    .isLength({ min: 20 }),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('new_post_form', {
        title: 'Add  new post',
        errors: errors.array(),
        formTitle: req.body.title,
        content: req.body.content,
        user: req.user,
      });
    } else {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.user._id,
      }).save((err) => {
        if (err) {
          next(err);
        }
        res.redirect('/');
      });
    }
  },
];

exports.getMembershipPage = function (req, res, next) {
  if (req.user) {
    res.render('membership', {
      title: 'Membership Privileges',
      user: req.user,
    });
  } else {
    res.render('forbidden_page', { title: 'Members only', user: null });
  }
};

exports.getMemberForm = function (req, res, next) {
  if (req.user && !req.user.member) {
    res.render('members_form_page', {
      title: 'Member Access',
      user: req.user,
      incorrectPassword: false,
    });
  } else if (req.user && req.user.member) {
    res.render('member_denial', {
      title: 'Member Access',
      user: req.user,
    });
  } else {
    res.render('forbidden_page', { title: 'Members only', user: null });
  }
};

exports.postMemberForm = [
  body('password', 'Incorrect password').escape().trim(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty() || req.body.password !== 'topsecret') {
      res.render('members_form_page', {
        title: 'Member Access',
        user: req.user,
        incorrectPassword: true,
      });
    } else if (req.body.password === 'topsecret') {
      User.findByIdAndUpdate(
        req.user._id,
        { member: true },
        function (err, user) {
          if (err) {
            console.log(error);
          } else {
            res.redirect('/member-success');
          }
        }
      );
    }
  },
];

exports.getMemberSuccess = function (req, res, next) {
  if (req.user && req.user.member) {
    res.render('member_success', {
      title: 'Successful membership',
      user: req.user,
    });
  } else {
    res.render('forbidden_page', { title: 'Members only', user: null });
  }
};

exports.getAdminForm = function (req, res, next) {
  if (req.user && !req.user.admin) {
    res.render('admin_form_page', {
      title: 'Admin Access',
      user: req.user,
      incorrectPassword: false,
    });
  } else if (req.user && req.user.admin) {
    res.render('admin_denial', {
      title: 'Admin Access',
      user: req.user,
    });
  } else {
    res.render('forbidden_page', { title: 'Members only', user: null });
  }
};

exports.postAdminForm = [
  body('password', 'Incorrect password').escape().trim(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty() || req.body.password !== 'supertopsecret') {
      res.render('admin_form_page', {
        title: 'Admin Access',
        user: req.user,
        incorrectPassword: true,
      });
    } else if (req.body.password === 'supertopsecret') {
      User.findByIdAndUpdate(
        req.user._id,
        { admin: true },
        function (err, user) {
          if (err) {
            console.log(error);
          } else {
            console.log(user);
            res.redirect('/admin-success');
          }
        }
      );
    }
  },
];

exports.getAdminSuccess = function (req, res, next) {
  if (req.user && req.user.admin) {
    res.render('admin_success', {
      title: 'Successful Admin Privelege',
      user: req.user,
    });
  } else {
    res.render('forbidden_page', { title: 'Members only', user: null });
  }
};

exports.deletePost = function (req, res, next) {
  if (req.user && req.user.admin) {
    const id = req.params.id;
    Post.findByIdAndDelete(id, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
};
