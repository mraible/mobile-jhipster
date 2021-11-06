import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Album } from './album.model';
import { AlbumService } from './album.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-album-detail',
  templateUrl: 'album-detail.html',
})
export class AlbumDetailPage implements OnInit {
  album: Album = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private albumService: AlbumService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.album = response.data;
    });
  }

  open(item: Album) {
    this.navController.navigateForward('/tabs/entities/album/' + item.id + '/edit');
  }

  async deleteModal(item: Album) {
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
            this.albumService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/album');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
