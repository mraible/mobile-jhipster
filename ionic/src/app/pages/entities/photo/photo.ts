import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Photo } from './photo.model';
import { PhotoService } from './photo.service';

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {
  photos: Photo[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private photoService: PhotoService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.photos = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.photoService
      .query()
      .pipe(
        filter((res: HttpResponse<Photo[]>) => res.ok),
        map((res: HttpResponse<Photo[]>) => res.body)
      )
      .subscribe(
        (response: Photo[]) => {
          this.photos = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: Photo) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/photo/new');
  }

  async edit(item: IonItemSliding, photo: Photo) {
    await this.navController.navigateForward('/tabs/entities/photo/' + photo.id + '/edit');
    await item.close();
  }

  async delete(photo) {
    this.photoService.delete(photo.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Photo deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(photo: Photo) {
    await this.navController.navigateForward('/tabs/entities/photo/' + photo.id + '/view');
  }
}
