const UsersApi = require('./app/api/usersapi');
const TweetsApi = require('./app/api/tweetsapi');

module.exports = [
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },

  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'POST', path: '/api/users/admin', config: UsersApi.createAdmin },

  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'GET', path: '/api/users', config: UsersApi.findAll },
  { method: 'GET', path: '/api/users/admin', config: UsersApi.findAdmins },
  { method: 'GET', path: '/api/users/~', config: UsersApi.findNonAdmins },

  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
    // non-admin only
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },
    // all users
  { method: 'DELETE', path: '/api/users/~', config: UsersApi.delete },

  { method: 'POST', path: '/api/users/{id}', config: UsersApi.updateDetails },
  { method: 'GET', path: '/api/users/{id}/follow', config: UsersApi.follow },
  { method: 'GET', path: '/api/users/{id}/unfollow', config: UsersApi.unfollow },

  { method: 'POST', path: '/api/tweets', config: TweetsApi.newTweet },

  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'GET', path: '/api/tweets', config: TweetsApi.findAll },
  { method: 'GET', path: '/api/users/{id}/tweets', config: TweetsApi.findAllForUser },
  { method: 'GET', path: '/api/users/{id}/timeline', config: TweetsApi.findAllByFollowing },

  // TODO { method: 'GET', path: '/api/tweets', config: TweetsApi.findAllBySearchString },

  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },
  { method: 'DELETE', path: '/api/users/{id}/tweets', config: TweetsApi.deleteAllForUser },

  // TODO { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAllBySearchString },
];

