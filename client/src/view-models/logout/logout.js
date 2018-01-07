import TweetService from '../../services/tweet-service';
import {inject} from 'aurelia-framework';

@inject(TweetService)
export class Logout {

  constructor(ts) {
    this.tweetService = ts;
  }

  logout() {
    console.log('logging out');
    this.tweetService.logout();
  }
}
