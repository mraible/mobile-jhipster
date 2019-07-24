import { Injectable } from '@angular/core';
import { CordovaBrowser } from 'ionic-appauth/lib/cordova';

@Injectable({
    providedIn: 'root'
})
export class BrowserService extends CordovaBrowser {
}
