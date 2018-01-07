'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let users = fixtures.users;
  let tweets = fixtures.tweets;
  let newTweetData = fixtures.tweets[0];
  let newTweet;
  let allTweets;
  const tweetService = new TweetService(fixtures.tweetService);
  tweetService.logout();
  tweetService.delete();
  const user1 = tweetService.createUser(users[0]);
  const user2 = tweetService.createUser(users[1]);
  tweetService.login(users[0]);
  tweetService.deleteAllTweets();

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  beforeEach(function () {
  });

  afterEach(function () {
  });

  test('create a tweet', function () {
    let returnedTweets = tweetService.getTweets();
    const oldLength = returnedTweets.length;
    newTweet = tweetService.newTweet(newTweetData);
    returnedTweets = tweetService.getTweets();
    const newLength = returnedTweets.length;
    assert.equal(newLength - oldLength, 1);
    assert.isDefined(newTweet._id);
    assert.isDefined(newTweet.date);
    assert.isDefined(newTweet.author);
    assert.deepEqual(newTweet.text, newTweetData.text);
  });

  test('get one tweet (by id), get all tweets', function () {

    const returnedTweet = tweetService.getTweet(newTweet._id.toString());
    assert.isDefined(returnedTweet._id);
    assert.isDefined(returnedTweet.date);
    assert.isDefined(returnedTweet.author);
    assert.deepEqual(returnedTweet.text, newTweet.text);

    // get all tweets
    for (let i = 1; i < tweets.length; i++) {
      tweetService.newTweet(tweets[i]);
    }

    allTweets = tweetService.getTweets();
    assert.equal(allTweets.length, tweets.length);
  });

  test('delete one tweet, all tweets', function () {
    const tweetCount = tweets.length;

    const randomTweetId = allTweets[getRndInteger(0, allTweets.length)]._id;
    tweetService.deleteOneTweet(randomTweetId);
    allTweets = tweetService.getTweets();
    assert.isNull(tweetService.getTweet(randomTweetId.toString));
    assert.equal(allTweets.length, tweetCount - 1);

    assert.isAbove(allTweets.length, 0);
    tweetService.deleteAllTweets();
    allTweets = tweetService.getTweets();
    assert.equal(allTweets.length, 0);
  });

  test('get all tweets for user', function () {
    tweetService.logout();
    const regUsers = [user1, user2];
    regUsers.forEach(function (user) {
      tweetService.login(user);
      tweets.forEach(function (tweet) {
        const newTweet = {
          text: tweet.text + ' ' + user.firstName,
        };
        tweetService.newTweet(newTweet);
      });

      tweetService.logout();
    });

    regUsers.forEach(function (user) {
      let login = {
        email: user.email,
        password: user.password,
      };

      tweetService.login(login);
      let allTweetsForUser = tweetService.getAllTweetsForUser(user._id);
      const rndTweet = allTweetsForUser[getRndInteger(0, allTweetsForUser.length)];
      assert.equal(rndTweet.author, user._id);
      assert.include(rndTweet.text, user.firstName);
      assert.equal(allTweetsForUser.length, tweets.length);

      tweetService.deleteAllTweetsForUser(user._id);
      allTweetsForUser = tweetService.getAllTweetsForUser(user._id);
      assert.equal(allTweetsForUser.length, 0);
      tweetService.logout();
    });
  });

  test('get all tweets by follows (timeline', function () {
    tweetService.deleteAllTweets();
    for (let i = 2; i < users.length; i++) {
      tweetService.createUser(users[i]);
    }

    tweetService.login(user1);
    const allUsers = tweetService.getUsers();
    tweetService.logout();
    allUsers.forEach(function (user) {
      tweets.forEach(function (tweet) {
        const newTweet = {
          text: tweet.text + ' ' + user.firstName,
        };
        tweetService.login(user);
        tweetService.newTweet(newTweet);
        tweetService.logout();
      });
    });

    tweetService.login(allUsers[0]);
    let array = [];
    for (let i = 1; i < allUsers.length; i++) {
      tweetService.follow(allUsers[0]._id, allUsers[i]._id);
      array = array.concat(tweetService.getAllTweetsForUser(allUsers[i]._id));
    }

    const timeline = tweetService.getTimeline(allUsers[0]._id);

    array.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    assert.deepEqual(timeline, array);
  });

});
