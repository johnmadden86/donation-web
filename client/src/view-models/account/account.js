import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweetService from '../../services/tweet-service';

@inject(EventAggregator, TweetService)
export class Account {

  constructor(ea, ts) {
    this.ts = ts;
  }
}
