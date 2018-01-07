'use strict';

const Tweet = require('../models/tweet');
const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils.js');

exports.findAll = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.find({})
        .sort({ date: -1 }) //reverse chron sort
        .populate('author')
        .then(tweets => {
          reply(tweets);
        }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

exports.findOne = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id })
        .populate('author')
        .then(tweet => {
          reply(tweet);
        })
        .catch(err => {
          reply(Boom.notFound('id not found'));
        });
  },
};

exports.newTweet = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.date = new Date();
    tweet.author = utils.getUserIdFromRequest(request);
    console.log(tweet);
    tweet.save()
        .then(newTweet => {
          reply(newTweet).code(201);
          return Tweet.findOne(newTweet).populate('author');
        }).catch(err => {
      reply(Boom.badImplementation('error creating tweet'));
    });
  },
};

exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.remove({})
        .then(err => {
          reply().code(204);
        })
        .catch(err => {
          reply(Boom.badImplementation('error removing tweets'));
        });
  },
};

exports.deleteOne = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id })
        .then(tweet => {
          reply(tweet).code(204);
        })
        .catch(err => {
          reply(Boom.notFound('id not found'));
        });
  },
};

exports.findAllForUser = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.find({ author: request.params.id })
        .sort({ date: -1 }) //reverse chron sort
        .populate('author')
        .then(tweets => {
          reply(tweets);
        })
        .catch(err => {
          reply(Boom.notFound('id not found'));
        });
  },
};

exports.deleteAllForUser = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.remove({ author: request.params.id })
        .then(tweets => {
          reply(tweets).code(204);
        })
        .catch(err => {
          reply(Boom.notFound('id not found'));
        });
  },
};

exports.findAllByFollowing = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.find({ _id: request.params.id })
        .then(user => {
          const following = user[0].following;
          Tweet.find({ author: following })
              .sort({ date: -1 }) //reverse chron sort
              //.populate('author')
              .then(tweets => {
                reply(tweets);
              })
              .catch(err => {
                reply(Boom.notFound('tweets not found'));
              });
        })
        .catch(err => {
          reply(Boom.notFound('user not found'));
        });
  },
};
