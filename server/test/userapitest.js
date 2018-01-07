'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');
const uuid = require('uuid');

suite('User API tests', function () {

  let users = fixtures.users;
  const tweetService = new TweetService(fixtures.tweetService);
  const user1 = tweetService.createUser(users[0]);
  const user2 = tweetService.createUser(users[1]);
  let allUsers;

  beforeEach(function () {
    tweetService.login(users[0]);
  });

  afterEach(function () {
    tweetService.logout();
  });

  test('create a user', function () {
    let returnedUser = tweetService.createUser(users[2]);
    assert.isDefined(returnedUser._id);
    assert.isFalse(returnedUser.admin);
    returnedUser = tweetService.createAdmin(users[3]);
    assert.isDefined(returnedUser._id);
    assert.isTrue(returnedUser.admin);
  });

  test('login-logout', function () {
    tweetService.logout();
    let returnedTweets = tweetService.getTweets();
    assert.isNull(returnedTweets);

    const response = tweetService.login(users[0]);
    returnedTweets = tweetService.getTweets();
    assert.isNotNull(returnedTweets);

    tweetService.logout();
    returnedTweets = tweetService.getTweets();
    assert.isNull(returnedTweets);
  });

  test('get one user', function () {
    tweetService.login(user1);
    const user = tweetService.getUser(user1._id);
    assert.deepEqual(user, user1);
  });

  test('get all users', function () {
    allUsers = tweetService.getUsers();
    const array = [];
    for (let i = 0; i < allUsers.length; i++) {
      const user = tweetService.getUser(allUsers[i]._id);
      array.push(user);
    }

    assert.deepEqual(allUsers, array);
  });

  test('get all admin users', function () {
    const allAdmins = tweetService.getAdmins();
    const array = [];
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].admin === true) {
        array.push(allUsers[i]);
      }
    }

    assert.deepEqual(allAdmins, array);
  });

  test('get all non-admin users', function () {
    const allNonAdmins = tweetService.getNonAdmin();
    const array = [];
    for (let i = 0; i < allUsers.length; i++) {
      const user = tweetService.getUser(allUsers[i]._id);
      if (user.admin === false) {
        array.push(user);
      }
    }

    assert.deepEqual(allNonAdmins, array);
  });

  test('get invalid user', function () {
    const u1 = tweetService.getUser(uuid());
    assert.isNull(u1);
  });

  test('update details', function () {
    const details = {
      firstName: 'Ned',
      lastName: 'Flanders',
      email: 'ned@flanders.com',
      password: 'password',
    };

    const userId = user1._id;
    tweetService.updateUserDetails(userId, details);
    const user = tweetService.getUser(userId);
    assert.equal(user.firstName, details.firstName);
    assert.equal(user.lastName, details.lastName);
    assert.equal(user.email, details.email);
    // assert.equal(user.password, details.password);

  });

  test('follow new user', function () {
    const currentUserId = user1._id;
    console.log('currentUserId ' + currentUserId);
    const userIdToFollow = user2._id;
    console.log('userIdToFollow ' + userIdToFollow);
    tweetService.follow(currentUserId, userIdToFollow);
    assert.notEqual(user1.following.indexOf(userIdToFollow), -1);
  });

  test('unfollow user', function () {
    const currentUserId = user1._id;
    console.log('currentUserId ' + currentUserId);
    const userIdToUnfollow = user2._id;
    console.log('userIdToFollow ' + userIdToUnfollow);
    tweetService.unfollow(currentUserId, userIdToUnfollow);
    assert.equal(user1.following.indexOf(userIdToUnfollow), -1);
  });

  test('delete one user', function () {
    const oldSize = allUsers.length;
    const userId = allUsers[3]._id;
    // assert.isNotNull(tweetService.getUser(userId));
    tweetService.deleteOneUser(userId);
    assert.isNull(tweetService.getUser(userId.toString));
    allUsers = tweetService.getUsers();
    const newSize = allUsers.length;
    assert.equal(oldSize - newSize, 1);
  });

  test('delete all (non-admin) users', function () {
    // NB deleting all users would invalidate authentication
    // and require an unauthenticated route to view changes.
    // This has been omitted.
    tweetService.deleteAllUsers();
    assert.isNull(tweetService.getNonAdmin());
    tweetService.delete();
  });
});
