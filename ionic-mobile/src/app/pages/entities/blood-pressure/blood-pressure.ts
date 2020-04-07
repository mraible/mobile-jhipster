import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { BloodPressure } from './blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';

@Component({
  selector: 'page-blood-pressure',
  templateUrl: 'blood-pressure.html',
})
export class BloodPressurePage {
  bloodPressures: BloodPressure[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private bloodPressureService: BloodPressureService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.bloodPressures = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.bloodPressureService
      .query()
      .pipe(
        filter((res: HttpResponse<BloodPressure[]>) => res.ok),
        map((res: HttpResponse<BloodPressure[]>) => res.body)
      )
      .subscribe(
        (response: BloodPressure[]) => {
          this.bloodPressures = response;
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

  trackId(index: number, item: BloodPressure) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/blood-pressure/new');
  }

  edit(item: IonItemSliding, bloodPressure: BloodPressure) {
    this.navController.navigateForward('/tabs/entities/blood-pressure/' + bloodPressure.id + '/edit');
    item.close();
  }

  async delete(bloodPressure) {
    this.bloodPressureService.delete(bloodPressure.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'BloodPressure deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(bloodPressure: BloodPressure) {
    this.navController.navigateForward('/tabs/entities/blood-pressure/' + bloodPressure.id + '/view');
  }
}
