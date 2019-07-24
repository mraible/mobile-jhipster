import { Injectable } from '@angular/core';
import { CordovaSecureStorage } from 'ionic-appauth/lib/cordova';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService extends CordovaSecureStorage{
}
