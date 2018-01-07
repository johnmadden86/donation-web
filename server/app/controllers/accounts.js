'use strict';

const Joi = require('joi');
const User = require('../models/user');

function setCookie(request, userId) {
  request.cookieAuth.set({
    loggedIn: true,
    loggedInUser: userId,
  });
  console.log('Cookie set: ' + userId);
}

function clearCookie(request) {
  request.cookieAuth.set({
    loggedIn: false,
    loggedInUser: null,
  });
}

function getLoggedInUser(request) {
  const userId = request.auth.credentials.loggedInUser;
  return User.findOne({ _id: userId });
}

exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },
};

exports.admin = {
  auth: false,
  handler: function (request, reply) {
    reply.view('adminsignup', { title: 'Register New Admin' });
  },
};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for MyTweet' });
  },
};

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to MyTweet' });
  },
};

exports.register = {
  auth: false,

  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  handler:
      function (request, reply) {
        const data = request.payload;
        data.admin = false;
        data.tweets = [];
        new User(data)
            .save()
            .then(newUser => {
              setCookie(request, newUser._id);
              reply.redirect('/home');
            })
            .catch(err => {
          reply.redirect('/');
        });
      },
};

exports.registerAdmin = {
  auth: false,

  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      adminPassword: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  handler:
      function (request, reply) {
        const data = request.payload;
        User.findOne({
          $and: [
            { admin: true },
            { password: data.adminPassword },
          ],
        })
            .then(foundAdmin => {
              if (foundAdmin.admin === true && foundAdmin.password === data.adminPassword) {
                delete data.adminPassword;
                data.admin = true;
                new User(data)
                    .save()
                    .then(newUser => {
                      setCookie(request, newUser._id);
                      reply.redirect('/home');
                    }).catch(err => {
                  reply.redirect('/');
                });
              } else {
                reply.redirect('/');
              }
            }).catch(err => {
          reply.redirect('/');
        });
      },
};

exports.authenticate = {
  auth: false,

  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  handler: function (request, reply) {
    const user = request.payload;
    console.log(user);
    User.findOne({ email: user.email })
        .then(foundUser => {
          if (foundUser && foundUser.password === user.password) {
            setCookie(request, foundUser._id);
            reply.redirect('/home');
          } else {
            reply.redirect('/login');
          }
        })
        .catch(err => {
          reply.redirect('/');
        });
  },
};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    clearCookie(request);
    reply.redirect('/');
  },
};

exports.viewSettings = {
  handler: function (request, reply) {
    getLoggedInUser(request).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/home');
    });
  },
};

exports.updateSettings = {
  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      getLoggedInUser(request).then(foundUser => {
        reply.view('settings', {
          title: 'Update error',
          user: foundUser,
          errors: error.data.details,
        }).code(400);
      }).catch(err => {
        reply.redirect('/home');
      });
    },
  },

  handler: function (request, reply) {
    const currentUserId = request.auth.credentials.loggedInUser;
    const updatedUser = request.payload;
    User.findOne({ id: currentUserId }).then(foundUser => {
      foundUser.firstName = updatedUser.firstName;
      foundUser.lastName = updatedUser.lastName;
      foundUser.email = updatedUser.email;
      foundUser.password = updatedUser.password;
      return foundUser.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    });
  },
};

