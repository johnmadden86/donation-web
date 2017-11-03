'use strict';

const Joi = require('joi');
const Tweet = require('../models/tweet');
const User = require('../models/user');

function getLoggedInUser(request) {
  const userId = request.auth.credentials.loggedInUser;
  return User.findOne({ _id: userId });
}

exports.home = {
  handler: function (request, reply) {
    getLoggedInUser(request).then(user => {
      reply.view('home', {
        title: 'New Tweet',
        user: user,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.timeline = {
  handler: function (request, reply) {
    getLoggedInUser(request)
        .then(loggedInUser => {
          User.find({}) //find all users, no filter
              .then(user => {
                Tweet.find({}) // find all tweets, no filter
                    .populate('author') //populates author for each tweet
                    .then(allTweets => {
                      reply.view('timeline', {
                        title: 'Timeline',
                        tweets: allTweets,
                        user: loggedInUser,
                      });
                    }).catch(err => {
                  reply.redirect('./home');
                });
              });
        });
  },
};

exports.profile = {
  handler: function (request, reply) {
    getLoggedInUser(request) // finds logged in user only
        .then(user => {
          Tweet.find({ author: user }) // only finds tweets composed by current user
              .populate('author')
              .then(userTweets => {
                reply.view('profile', {
                  title: 'Profile',
                  tweets: userTweets,
                  user: user,
                });
              }).catch(err => {
            reply.redirect('./home');
          });
        });
  },
};

exports.filter = {
  handler: function (request, reply) {
    getLoggedInUser(request).then(user => {
      Tweet.find(
          {
            text: {
              //TO-DO
              $regex: /string/i, // e.g. return tweets matching search term
            },
          }
      ).populate('author')
          .then(filteredTweets => {
            reply.view('profile', {
              title: 'Profile',
              tweets: filteredTweets,
              user: user,
            });
          }).catch(err => {
        reply.redirect('./home');
      });
    });
  },
};

exports.tweet = {
  validate: {
    payload: {
      text: Joi.required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      getLoggedInUser(request)
          .then(user => {
            reply.view('home', {
              title: 'New Tweet',
              user: user,
              errors: error.data.details,
            }).code(400);
          }).catch(err => {
        reply.redirect('./home');
      });

    },
  },

  handler: function (request, reply) {
    getLoggedInUser(request)
        .then(user => {
          const data = request.payload;
          data.date = new Date();
          data.author = user;
          new Tweet(data).save()
              .then(newTweet => {
                reply.redirect('./timeline');
              }).catch(err => {
            reply.redirect('/home');
          });
        });
  },
};
