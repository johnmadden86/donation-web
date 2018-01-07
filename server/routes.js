const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const TweetsApi = require('./app/api/tweetsapi');
const Assets = require('./app/controllers/assets');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/admin', config: Accounts.admin },
  { method: 'GET', path: '/users', config: Tweets.users },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/register-admin', config: Accounts.registerAdmin },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/profile/{_id}', config: Tweets.profile },
  { method: 'GET', path: '/timeline', config: Tweets.timeline },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },
  { method: 'GET', path: '/delete-tweet/{_id}', config: Tweets.deleteTweet },
  { method: 'GET', path: '/delete-all-tweets', config: Tweets.deleteAllTweets },
  { method: 'GET', path: '/delete-user/{_id}', config: Tweets.deleteUser },
  { method: 'GET', path: '/delete-all-users', config: Tweets.deleteAllUsers },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];
