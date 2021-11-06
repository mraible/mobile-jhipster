import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Tag } from './tag.model';
import { TagService } from './tag.service';

@Component({
  selector: 'page-tag',
  templateUrl: 'tag.html',
})
export class TagPage {
  tags: Tag[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private tagService: TagService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.tags = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.tagService
      .query()
      .pipe(
        filter((res: HttpResponse<Tag[]>) => res.ok),
        map((res: HttpResponse<Tag[]>) => res.body)
      )
      .subscribe(
        (response: Tag[]) => {
          this.tags = response;
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

  trackId(index: number, item: Tag) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/tag/new');
  }

  async edit(item: IonItemSliding, tag: Tag) {
    await this.navController.navigateForward('/tabs/entities/tag/' + tag.id + '/edit');
    await item.close();
  }

  async delete(tag) {
    this.tagService.delete(tag.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Tag deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(tag: Tag) {
    await this.navController.navigateForward('/tabs/entities/tag/' + tag.id + '/view');
  }
}
