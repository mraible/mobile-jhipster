import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthActions, AuthObserver, AuthService, IAuthAction } from 'ionic-appauth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  action: IAuthAction;
  observer: AuthObserver;

  constructor(private authService: AuthService, private navCtrl: NavController) {}

  ngOnInit() {
    this.authService.loadTokenFromStorage();
    this.observer = this.authService.addActionListener((action) => this.onSignInSuccess(action));
  }

  ngOnDestroy() {
    this.authService.removeActionObserver(this.observer);
  }

  public signIn() {
    this.authService.signIn();
  }

  private onSignInSuccess(action: IAuthAction) {
    this.action = action;
    if (action.action === AuthActions.SignInSuccess || action.action === AuthActions.LoadTokenFromStorageSuccess) {
      this.navCtrl.navigateRoot('tabs');
    }
  }
}
