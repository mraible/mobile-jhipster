import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Photo } from './photo.model';
import { PhotoService } from './photo.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-photo-detail',
  templateUrl: 'photo-detail.html',
})
export class PhotoDetailPage implements OnInit {
  photo: Photo = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private photoService: PhotoService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.photo = response.data;
    });
  }

  open(item: Photo) {
    this.navController.navigateForward('/tabs/entities/photo/' + item.id + '/edit');
  }

  async deleteModal(item: Photo) {
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
            this.photoService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/photo');
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
