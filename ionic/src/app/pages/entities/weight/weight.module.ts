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

import { WeightPage } from './weight';
import { WeightUpdatePage } from './weight-update';
import { Weight, WeightService, WeightDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class WeightResolve implements Resolve<Weight> {
  constructor(private service: WeightService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Weight> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Weight>) => response.ok),
        map((weight: HttpResponse<Weight>) => weight.body)
      );
    }
    return of(new Weight());
  }
}

const routes: Routes = [
  {
    path: '',
    component: WeightPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WeightUpdatePage,
    resolve: {
      data: WeightResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WeightDetailPage,
    resolve: {
      data: WeightResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WeightUpdatePage,
    resolve: {
      data: WeightResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [WeightPage, WeightUpdatePage, WeightDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class WeightPageModule {}
