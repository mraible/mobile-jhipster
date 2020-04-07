import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Preferences } from './preferences.model';
import { PreferencesService } from './preferences.service';

@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html',
})
export class PreferencesPage {
  preferences: Preferences[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private preferencesService: PreferencesService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.preferences = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.preferencesService
      .query()
      .pipe(
        filter((res: HttpResponse<Preferences[]>) => res.ok),
        map((res: HttpResponse<Preferences[]>) => res.body)
      )
      .subscribe(
        (response: Preferences[]) => {
          this.preferences = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: Preferences) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/preferences/new');
  }

  edit(item: IonItemSliding, preferences: Preferences) {
    this.navController.navigateForward('/tabs/entities/preferences/' + preferences.id + '/edit');
    item.close();
  }

  async delete(preferences) {
    this.preferencesService.delete(preferences.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Preferences deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(preferences: Preferences) {
    this.navController.navigateForward('/tabs/entities/preferences/' + preferences.id + '/view');
  }
}
