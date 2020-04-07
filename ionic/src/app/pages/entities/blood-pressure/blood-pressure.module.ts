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

import { BloodPressurePage } from './blood-pressure';
import { BloodPressureUpdatePage } from './blood-pressure-update';
import { BloodPressure, BloodPressureService, BloodPressureDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class BloodPressureResolve implements Resolve<BloodPressure> {
  constructor(private service: BloodPressureService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BloodPressure> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<BloodPressure>) => response.ok),
        map((bloodPressure: HttpResponse<BloodPressure>) => bloodPressure.body)
      );
    }
    return of(new BloodPressure());
  }
}

const routes: Routes = [
  {
    path: '',
    component: BloodPressurePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BloodPressureUpdatePage,
    resolve: {
      data: BloodPressureResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BloodPressureDetailPage,
    resolve: {
      data: BloodPressureResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BloodPressureUpdatePage,
    resolve: {
      data: BloodPressureResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [BloodPressurePage, BloodPressureUpdatePage, BloodPressureDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class BloodPressurePageModule {}
