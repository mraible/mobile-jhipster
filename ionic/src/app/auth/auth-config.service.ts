import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthConfigService {
  private authConfig;

  constructor(private http: HttpClient) {}

  loadAuthConfig() {
    return this.http
      .get(`${environment.apiUrl}/auth-info`)
      .toPromise()
      .then((data) => {
        this.authConfig = data;
        // Override issuer and client ID with values from API
        if (this.authConfig.issuer.endsWith('/')) {
          this.authConfig.issuer = this.authConfig.issuer.substring(0, this.authConfig.issuer.length - 1);
        }
        environment.oidcConfig.server_host = this.authConfig.issuer;
        environment.oidcConfig.client_id = 'Dz7Oc9Zv9onjUBsdC55wReC4ifGMlA7G';
      })
      .catch((error) => {
        console.error('Failed to fetch remote OIDC configuration.');
        console.error(error);
      });
  }

  getConfig() {
    return this.authConfig;
  }
}
