import { Component, OnInit } from '@angular/core';
import { Tag } from './tag.model';
import { TagService } from './tag.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-tag-detail',
  templateUrl: 'tag-detail.html',
})
export class TagDetailPage implements OnInit {
  tag: Tag = {};

  constructor(
    private navController: NavController,
    private tagService: TagService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.tag = response.data;
    });
  }

  open(item: Tag) {
    this.navController.navigateForward('/tabs/entities/tag/' + item.id + '/edit');
  }

  async deleteModal(item: Tag) {
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
            this.tagService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/tag');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
