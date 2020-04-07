import { Component, OnInit } from '@angular/core';
import { Weight } from './weight.model';
import { WeightService } from './weight.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-weight-detail',
  templateUrl: 'weight-detail.html',
})
export class WeightDetailPage implements OnInit {
  weight: Weight = {};

  constructor(
    private navController: NavController,
    private weightService: WeightService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.weight = response.data;
    });
  }

  open(item: Weight) {
    this.navController.navigateForward('/tabs/entities/weight/' + item.id + '/edit');
  }

  async deleteModal(item: Weight) {
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
            this.weightService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/weight');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
