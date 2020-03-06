import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss']
})
export class EntitiesPage {
  entities: Array<any> = [
    {name: 'Points', component: 'PointsPage', route: 'points'},
    {name: 'BloodPressure', component: 'BloodPressurePage', route: 'blood-pressure'},
    {name: 'Weight', component: 'WeightPage', route: 'weight'},
    {name: 'Preferences', component: 'PreferencesPage', route: 'preferences'},
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
