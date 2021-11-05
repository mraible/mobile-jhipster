import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { AlbumPage } from './album';
import { AlbumUpdatePage } from './album-update';
import { Album, AlbumService, AlbumDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AlbumResolve implements Resolve<Album> {
  constructor(private service: AlbumService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Album> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Album>) => response.ok),
        map((album: HttpResponse<Album>) => album.body)
      );
    }
    return of(new Album());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AlbumPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AlbumUpdatePage,
    resolve: {
      data: AlbumResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AlbumDetailPage,
    resolve: {
      data: AlbumResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AlbumUpdatePage,
    resolve: {
      data: AlbumResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AlbumPage, AlbumUpdatePage, AlbumDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AlbumPageModule {}
