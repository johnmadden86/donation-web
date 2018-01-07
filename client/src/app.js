import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './services/messages';
import TweetService from './services/tweet-service';

@inject(TweetService, Aurelia, EventAggregator)
export class App {

  constructor(ts, au, ea) {
    this.au = au;
    this.ts = ts;
    ea.subscribe(LoginStatus, msg => {
      this.router.navigate('/', { replace: true, trigger: false });
      this.router.reset();
      if (msg.status === true) {
        au.setRoot('home');
      } else {
        au.setRoot('app');
      }
    });
  }

  attached() {
    if (this.ts.isAuthenticated()) {
      this.au.setRoot('home').then(() => {
        this.router.navigateToRoute('new-tweet');
      });
    }
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'login'], name: 'login', moduleId: 'view-models/login/login', nav: true, title: 'Login' },
      { route: 'sign-up', name: 'sign-up', moduleId: 'view-models/sign-up/sign-up', nav: true, title: 'Sign Up' }
    ]);
    this.router = router;
  }
}
