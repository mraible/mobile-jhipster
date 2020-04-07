import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Weight } from './weight.model';
import { WeightService } from './weight.service';

@Component({
  selector: 'page-weight',
  templateUrl: 'weight.html',
})
export class WeightPage {
  weights: Weight[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private weightService: WeightService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.weights = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.weightService
      .query()
      .pipe(
        filter((res: HttpResponse<Weight[]>) => res.ok),
        map((res: HttpResponse<Weight[]>) => res.body)
      )
      .subscribe(
        (response: Weight[]) => {
          this.weights = response;
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

  trackId(index: number, item: Weight) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/weight/new');
  }

  edit(item: IonItemSliding, weight: Weight) {
    this.navController.navigateForward('/tabs/entities/weight/' + weight.id + '/edit');
    item.close();
  }

  async delete(weight) {
    this.weightService.delete(weight.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Weight deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(weight: Weight) {
    this.navController.navigateForward('/tabs/entities/weight/' + weight.id + '/view');
  }
}
