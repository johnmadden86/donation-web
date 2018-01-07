import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class SignUp {

  firstName = '';
  lastName = '';
  email = '';
  password = '';

  constructor(ts) {
    this.tweetService = ts;
  }

  register(e) {
    this.tweetService.register(this.firstName, this.lastName, this.email, this.password);
    this.tweetService.login(this.email, this.password);
  }
}
