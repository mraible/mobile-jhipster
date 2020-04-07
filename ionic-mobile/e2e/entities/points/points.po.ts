import { element, by, ElementFinder } from 'protractor';
export class PointsComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Points found.'));
  entities = element.all(by.css('ion-text'));

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

export class PointsUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  exerciseInput = element(by.css('ion-input[formControlName="exercise"] input'));
  mealsInput = element(by.css('ion-input[formControlName="meals"] input'));
  alcoholInput = element(by.css('ion-input[formControlName="alcohol"] input'));
  notesInput = element(by.css('ion-input[formControlName="notes"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setExerciseInput(exercise: string): Promise<void> {
    await this.exerciseInput.sendKeys(exercise);
  }
  async setMealsInput(meals: string): Promise<void> {
    await this.mealsInput.sendKeys(meals);
  }
  async setAlcoholInput(alcohol: string): Promise<void> {
    await this.alcoholInput.sendKeys(alcohol);
  }
  async setNotesInput(notes: string): Promise<void> {
    await this.notesInput.sendKeys(notes);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class PointsDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));

  exerciseInput = element.all(by.css('span')).get(2);

  mealsInput = element.all(by.css('span')).get(3);

  alcoholInput = element.all(by.css('span')).get(4);

  notesInput = element.all(by.css('span')).get(5);

  async getExerciseInput(): Promise<string> {
    return await this.exerciseInput.getText();
  }

  async getMealsInput(): Promise<string> {
    return await this.mealsInput.getText();
  }

  async getAlcoholInput(): Promise<string> {
    return await this.alcoholInput.getText();
  }

  async getNotesInput(): Promise<string> {
    return await this.notesInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
