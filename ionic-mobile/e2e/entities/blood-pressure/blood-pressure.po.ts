import { element, by, ElementFinder } from 'protractor';
export class BloodPressureComponentsPage {
    createButton = element(by.css('ion-fab-button'));
    viewButtons = element.all(by.css('ion-item'));
    title = element.all(by.css('ion-title')).get(2);
    noResult = element(by.cssContainingText('ion-label', 'No Blood Pressures found.'));
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

    async getEntitiesNumber(): Promise <number> {
      return await this.entities.count();
    }
}


export class BloodPressureUpdatePage {
    pageTitle = element.all(by.css('ion-title')).get(3);
    saveButton = element.all(by.css('ion-button')).get(1);

    systolicInput = element(by.css('ion-input[formControlName="systolic"] input'));
    diastolicInput = element(by.css('ion-input[formControlName="diastolic"] input'));


    async getPageTitle(): Promise<string> {
        return this.pageTitle.getText();
    }

    async setSystolicInput(systolic: string): Promise<void> {
        await this.systolicInput.sendKeys(systolic);
    }
    async setDiastolicInput(diastolic: string): Promise<void> {
        await this.diastolicInput.sendKeys(diastolic);
    }

    async save(): Promise<void> {
        await this.saveButton.click();
    }
}

export class BloodPressureDetailPage {
    pageTitle = element.all(by.css('ion-title')).get(3);
    deleteButton = element(by.css('ion-button[color="danger"]'));

    systolicInput = element.all(by.css('span')).get(2);

    diastolicInput = element.all(by.css('span')).get(3);




    async getSystolicInput(): Promise<string> {
        return await this.systolicInput.getText();
    }

    async getDiastolicInput(): Promise<string> {
        return await this.diastolicInput.getText();
    }

    async clickOnDeleteButton(): Promise<void> {
      await this.deleteButton.click();
    }

    async getPageTitle(): Promise<string> {
      return this.pageTitle.getText();
    }
}
