import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'home'], name: 'new-tweet', moduleId: 'view-models/new-tweet/new-tweet', nav: true, title: 'New Tweet' },
      { route: 'timeline', name: 'timeline', moduleId: 'view-models/timeline/timeline', nav: true, title: 'Timeline' },
      { route: 'profile', name: 'profile', moduleId: 'view-models/profile/profile', nav: true, title: 'Profile' },
      //{ route: 'users', name: 'users', moduleId: 'view-models/users/users', nav: true, title: 'Users' },
      //{ route: 'account', name: 'account', moduleId: 'view-models/account/account', nav: true, title: 'Account' },
      //{ route: 'dashboard', name: 'dashboard', moduleId: 'view-models/dashboard/dashboard', nav: true, title: 'Dashboard' },
      { route: 'logout', name: 'logout', moduleId: 'view-models/logout/logout', nav: true, title: 'Logout' }
    ]);
    this.router = router;

    config.mapUnknownRoutes(instruction => {
      return 'home';
    });
  }
}
