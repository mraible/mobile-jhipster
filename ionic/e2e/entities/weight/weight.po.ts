import { element, by } from 'protractor';

export class WeightComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Weights found.'));
  entities = element.all(by.css('page-weight ion-item'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastViewButton(): Promise<void> {
    await this.viewButtons.last().click();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async getEntitiesNumber(): Promise<number> {
    return await this.entities.count();
  }
}

export class WeightUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  weightInput = element(by.css('ion-input[formControlName="weight"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setWeightInput(weight: string): Promise<void> {
    await this.weightInput.sendKeys(weight);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class WeightDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));

  weightInput = element.all(by.css('span')).get(2);

  async getWeightInput(): Promise<string> {
    return await this.weightInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
