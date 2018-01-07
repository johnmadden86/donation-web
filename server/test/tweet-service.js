'use strict';

const SyncHttpService = require('./sync-http-service');
const fixtures = require('./fixtures.json');

const baseUrl = fixtures.tweetService;

class TweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  login(user) {
    return this.httpService.setAuth('/api/users/authenticate', user);
  }

  logout() {
    this.httpService.clearAuth();
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  createAdmin(newUser) {
    return this.httpService.post('/api/users/admin', newUser);
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  getAdmins() {
    return this.httpService.get('/api/users/admin');
  }

  getNonAdmin() {
    return this.httpService.get('/api/users/~');
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  delete() {
    return this.httpService.delete('/api/users/~');
  }

  updateUserDetails(id, details) {
    return this.httpService.post('/api/users/' + id, details);
  }

  newTweet(newTweet) {
    return this.httpService.post('/api/tweets', newTweet);
  }

  getTweet(id) {
    return this.httpService.get('/api/tweets/' + id);
  }

  getTweets() {
    return this.httpService.get('/api/tweets');
  }

  deleteOneTweet(id) {
    return this.httpService.delete('/api/tweets/' + id);
  }

  deleteAllTweets() {
    return this.httpService.delete('/api/tweets');
  }

  follow(id, followId) {
    return this.httpService.get('/api/users/' + id + '/follow?_id=' + followId);
  }

  unfollow(id, followId) {
    return this.httpService.get('/api/users/' + id + '/unfollow?_id=' + followId);
  }

  getAllTweetsForUser(userId) {
    return this.httpService.get('/api/users/' + userId + '/tweets');
  }

  deleteAllTweetsForUser(userId) {
    return this.httpService.delete('/api/users/' + userId + '/tweets');
  }

  getTimeline(userId) {
    return this.httpService.get('/api/users/' + userId + '/timeline');
  }
}

module.exports = TweetService;
