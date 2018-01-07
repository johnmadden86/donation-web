import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import Fixtures from './fixtures';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoggedInUser, LoginStatus} from './messages';

@inject(HttpClient, Fixtures, EventAggregator)
export default class AsyncHttpClient {

  constructor(httpClient, fixtures, ea) {
    this.http = httpClient;
    this.http.configure(http => {
      http.withBaseUrl(fixtures.baseUrl);
    });
    this.ea = ea;
  }

  get(url) {
    return this.http.get(url);
  }

  post(url, obj) {
    return this.http.post(url, obj);
  }

  delete(url) {
    return this.http.delete(url);
  }

  authenticate(url, user) {
    this.http.post(url, user)
      .then(response => {
        const status = response.content;
        localStorage.tweet = JSON.stringify(status);
        if (status.success) {
          console.log('authentication successful');
          this.http.configure(configuration => {
            configuration.withHeader('Authorization', status.token);
          });
        }
        this.ea.publish(new LoginStatus(status));
        this.ea.publish(new LoggedInUser(status.user));
      })
      .catch(error => {
        const status = {
          success: false,
          message: 'service not available'
        };
        console.log('authentication unsuccessful');
        this.ea.publish(new LoginStatus(status));
      });
  }

  clearAuthentication() {
    localStorage.tweet = null;
    this.http.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
  }

  isAuthenticated() {
    let authenticated = false;
    if (localStorage.donation !== 'null') {
      authenticated = true;
      this.http.configure(http => {
        const auth = JSON.parse(localStorage.tweet);
        http.withHeader('Authorization', 'bearer ' + auth.token);
      });
    }
    return authenticated;
  }
}
