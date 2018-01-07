import {inject} from 'aurelia-framework';
import Fixtures from './fixtures';
import {LoggedInUser, LoginStatus} from './messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';

@inject(Fixtures, EventAggregator, AsyncHttpClient)
export default class TweetService {

  currentUser = {};
  tweet = {};
  allTweets = [];
  profileTweets = [];
  timelineTweets = [];

  constructor(data, ea, ac) {
    this.ea = ea;
    this.ac = ac;

    ea.subscribe(LoggedInUser, msg => {
      this.currentUser = msg.user;
      this.getAllTweetsForUser(msg.user._id);
      this.getTimeline(msg.user._id);
      console.log('current user: ' + this.currentUser.firstName + ' ' + this.currentUser.lastName);
    });
  }

  register(firstName, lastName, email, password) {
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    this.ac.post('/api/users', newUser)
      .then(res => {
        this.getUsers();
      });
  }

  registerNewAdmin(firstName, lastName, email, password) {
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    this.ac.post('/api/users/admin', newUser)
      .then(res => {
        this.getUsers();
      });
  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.ac.authenticate('/api/users/authenticate', user);
  }

  logout() {
    const status = {
      success: false,
      message: ''
    };
    this.ac.clearAuthentication();
    this.ea.publish(new LoginStatus(status));
  }

  isAuthenticated() {
    return this.ac.isAuthenticated();
  }

  getUsers() {
    this.ac.get('/api/users')
      .then(res => {
        this.users = res.content;
      });
  }

  getUser(id) {
    this.ac.get('/api/users/' + id)
      .then(res => {
        this.user = res.content;
      });
  }

  getAdmins() {
    this.ac.get('/api/users/admin')
      .then(res => {
        this.users = res.content;
      });
  }

  getNonAdmin() {
    this.ac.get('/api/users/~')
      .then(res => {
        this.users = res.content;
      });
  }

  deleteOneUser(id) {
    this.ac.delete('/api/users/' + id)
      .then(res => {
        this.users = this.getUsers();
      });
  }

  deleteAllUsers() {
    this.ac.delete('/api/users/')
      .then(res => {
        this.users = this.getUsers();
      });
  }

  updateUserDetails(id, details) {
    this.ac.post('/api/users/' + id, details)
      .then(res => {
        this.users = this.getUsers();
      });
  }

  newTweet(text) {
    let tweet = {
      text: text
    };
    console.log('attempting to post new tweet');
    this.ac.post('/api/tweets', tweet)
      .then(res => {
        this.profileTweets.unshift(res.content);
        console.log(this.currentUser._id);
        this.getAllTweetsForUser(this.currentUser._id);
      });
  }

  getTweets() {
    this.ac.get('/api/tweets').then(res => {
      this.allTweets = res.content;
    });
  }

  getTweet(id) {
    this.ac.get('/api/tweets/' + id)
      .then(res => {
        //this.ea.publish(new TweetUpdate(res.content));
      });
  }

  deleteOneTweet(id) {
    this.ac.delete('/api/tweets/' + id)
      .then(res => {
        this.tweets = this.getTweets();
      });
  }

  deleteAllTweets() {
    this.ac.delete('/api/tweets/')
      .then(res => {
        this.tweets = this.getTweets();
      });
  }

  follow(id, followId) {
    this.ac.get('/api/users/' + id + '/follow?_id=' + followId)
      .then(res => {
        this.users = this.getUsers();
      });
  }

  unfollow(id, followId) {
    this.ac.get('/api/users/' + id + '/unfollow?_id=' + followId)
      .then(res => {
        this.users = this.getUsers();
      });
  }

  getAllTweetsForUser(userId) {
    this.ac.get('/api/users/' + userId + '/tweets')
      .then(res => {
        this.profileTweets = res.content;
      });
  }

  deleteAllTweetsForUser(userId) {
    this.ac.delete('/api/users/' + userId + '/tweets')
      .then(res => {
        this.tweets = this.getTweets();
      });
  }

  getTimeline(userId) {
    this.ac.get('/api/users/' + userId + '/timeline')
      .then(res => {
        this.timelineTweets = res.content;
      });
  }
}
