import { Component, OnInit } from '@angular/core';
import { Preferences } from './preferences.model';
import { PreferencesService } from './preferences.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-preferences-detail',
  templateUrl: 'preferences-detail.html',
})
export class PreferencesDetailPage implements OnInit {
  preferences: Preferences = {};

  constructor(
    private navController: NavController,
    private preferencesService: PreferencesService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.preferences = response.data;
    });
  }

  open(item: Preferences) {
    this.navController.navigateForward('/tabs/entities/preferences/' + item.id + '/edit');
  }

  async deleteModal(item: Preferences) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.preferencesService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/preferences');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
