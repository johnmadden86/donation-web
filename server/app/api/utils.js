const jwt = require('jsonwebtoken');
const User = require('../models/user');
const utils = require('./utils.js');
const Boom = require('boom');

const tokenPassword = 'secretpasswordnotrevealedtoanyone';

exports.createToken = function (user) {
  return jwt.sign(
      { id: user._id, email: user.email }, tokenPassword, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

exports.decodeToken = function (token) {
  const userInfo = {};
  try {
    const decoded = jwt.verify(token, tokenPassword);
    console.log('decoded:' + decoded);
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e) {
    console.log('error decoding token');
  }

  return userInfo;
};

exports.validate = function (decoded, request, callback) {
  User.findOne({ _id: decoded.id })
      .then(user => {
        if (user !== null) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      })
      .catch(err => {
        callback(null, false);
      });
};

exports.getUserIdFromRequest = function (request) {
  let userId = null;
  try {
    const token = request.headers.authorization;
    console.log('JSON web token: ' + token);
    const tokenSplit = token.split('.');
    const header = tokenSplit[0];
    const payload = tokenSplit[1];
    const signature = tokenSplit[2];
    console.log('header: ' + header);
    console.log('payload: ' + payload);
    console.log('signature: ' + signature);
    const decodedHeader = utils.decodeToken(header);
    const decodedPayload = utils.decodeToken(payload);
    const decodedSignature = utils.decodeToken(signature);
    const decodedToken = utils.decodeToken(token);
    console.log(decodedHeader);
    console.log(decodedPayload);
    console.log(decodedSignature);
    console.log(decodedToken);

    userId = decodedToken.userId;
    console.log('userId ' + userId);
  } catch (e) {
    userId = null;
  }

  return userId;
};
