import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class NewTweet {

  text = 'Hello world!';

  constructor(ts) {
    this.tweetService = ts;
  }

  newTweet() {
    this.tweetService.newTweet(this.text);
  }
}
