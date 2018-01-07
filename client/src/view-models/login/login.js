import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Login {

  email = 'homer@simpson.com';
  password = 'secret';

  constructor(ts) {
    this.tweetService = ts;
  }

  login(e) {
    console.log(`Trying to log in ${this.email}`);
    this.tweetService.login(this.email, this.password);
  }
}
