import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Album } from './album.model';
import { AlbumService } from './album.service';

@Component({
  selector: 'page-album',
  templateUrl: 'album.html',
})
export class AlbumPage {
  albums: Album[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private albumService: AlbumService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.albums = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.albumService
      .query()
      .pipe(
        filter((res: HttpResponse<Album[]>) => res.ok),
        map((res: HttpResponse<Album[]>) => res.body)
      )
      .subscribe(
        (response: Album[]) => {
          this.albums = response;
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

  trackId(index: number, item: Album) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/album/new');
  }

  async edit(item: IonItemSliding, album: Album) {
    await this.navController.navigateForward('/tabs/entities/album/' + album.id + '/edit');
    await item.close();
  }

  async delete(album) {
    this.albumService.delete(album.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Album deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(album: Album) {
    await this.navController.navigateForward('/tabs/entities/album/' + album.id + '/view');
  }
}
