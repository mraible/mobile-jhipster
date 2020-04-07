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

import { PreferencesPage } from './preferences';
import { PreferencesUpdatePage } from './preferences-update';
import { Preferences, PreferencesService, PreferencesDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PreferencesResolve implements Resolve<Preferences> {
  constructor(private service: PreferencesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Preferences> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Preferences>) => response.ok),
        map((preferences: HttpResponse<Preferences>) => preferences.body)
      );
    }
    return of(new Preferences());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PreferencesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PreferencesUpdatePage,
    resolve: {
      data: PreferencesResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PreferencesDetailPage,
    resolve: {
      data: PreferencesResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PreferencesUpdatePage,
    resolve: {
      data: PreferencesResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PreferencesPage, PreferencesUpdatePage, PreferencesDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class PreferencesPageModule {}
