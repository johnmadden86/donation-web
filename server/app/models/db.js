'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let dbURI = 'mongodb://localhost/myTweet';
process.env.MONGOLAB_URI = 'mongodb://mytweetwebusername:mytweetwebpassword@ds245805.mlab.com:45805/mytweetweb';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

console.log('process.env.NODE_ENV: '  + process.env.NODE_ENV);
console.log('process.env.MONGOLAB_URI: '  + process.env.MONGOLAB_URI);
console.log('dbUri: '  + dbURI);

mongoose.connect(dbURI);

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  if (process.env.NODE_ENV !== 'production') {
    // seedData();
  }
});

function seedData() {
  let seeder = require('mongoose-seeder');
  const data = require('./data.json');
  const tweetData = require('./tweetdata.json');
  const Tweet = require('./tweet');
  const User = require('./user');
  seeder.seed(data, { dropDatabase: false, dropCollections: true })
      .then(dbData => {
        console.log('preloading Test Data');
        console.log(dbData);
      }).catch(err => {
    console.log(error);
  });
}
