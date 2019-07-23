import { Component, OnInit } from '@angular/core';
import { BloodPressure } from './blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'page-blood-pressure-detail',
    templateUrl: 'blood-pressure-detail.html'
})
export class BloodPressureDetailPage implements OnInit {
    bloodPressure: BloodPressure = {};

    constructor(
        private navController: NavController,
        private bloodPressureService: BloodPressureService,
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((response) => {
            this.bloodPressure = response.data;
        });
    }

    open(item: BloodPressure) {
        this.navController.navigateForward('/tabs/entities/blood-pressure/' + item.id + '/edit');
    }

    async deleteModal(item: BloodPressure) {
        const alert = await this.alertController.create({
            header: 'Confirm the deletion?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Delete',
                    handler: () => {
                        this.bloodPressureService.delete(item.id).subscribe(() => {
                            this.navController.navigateForward('/tabs/entities/blood-pressure');
                        });
                    }
                }
            ]
        });
        await alert.present();
    }


}
