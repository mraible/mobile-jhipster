import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthActions, AuthObserver, AuthService, IAuthAction } from 'ionic-appauth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
})
export class WelcomePage implements OnInit, OnDestroy {
  action: IAuthAction;
  authObserver: AuthObserver;

  constructor(private authService: AuthService, private navController: NavController) {}

  ngOnInit() {
    this.authService.loadTokenFromStorage();
    this.authObserver = this.authService.addActionListener((action) => this.onAction(action));
  }

  ngOnDestroy() {
    this.authService.removeActionObserver(this.authObserver);
  }

  private onAction(action: IAuthAction) {
    if (action.action === AuthActions.LoadTokenFromStorageSuccess || action.action === AuthActions.SignInSuccess) {
      this.navController.navigateRoot('/tabs');
    }
  }

  signIn() {
    this.authService.signIn().catch((error) => console.error(`Sign in error: ${error}`));
  }
}
