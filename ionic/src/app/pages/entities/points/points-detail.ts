import { Component, OnInit } from '@angular/core';
import { Points } from './points.model';
import { PointsService } from './points.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-points-detail',
  templateUrl: 'points-detail.html',
})
export class PointsDetailPage implements OnInit {
  points: Points = {};

  constructor(
    private navController: NavController,
    private pointsService: PointsService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.points = response.data;
    });
  }

  open(item: Points) {
    this.navController.navigateForward('/tabs/entities/points/' + item.id + '/edit');
  }

  async deleteModal(item: Points) {
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
            this.pointsService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/points');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
