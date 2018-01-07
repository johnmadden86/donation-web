import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Profile {

  tweets = [];

  constructor(ts) {
    this.tweetService = ts;
    this.tweets = this.tweetService.profileTweets;
    console.log(this.tweets);
  }
}
