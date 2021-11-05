import { element, by, browser, ElementFinder } from 'protractor';

export class PhotoComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Photos found.'));
  entities = element.all(by.css('page-photo ion-item'));

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

export class PhotoUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  descriptionInput = element(by.css('ion-textarea[formControlName="description"] textarea'));
  imageInput = element(by.css('ion-input[formControlName="image"] input'));
  heightInput = element(by.css('ion-input[formControlName="height"] input'));
  widthInput = element(by.css('ion-input[formControlName="width"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async setImageInput(image: string): Promise<void> {
    await this.imageInput.sendKeys(image);
  }
  async setHeightInput(height: string): Promise<void> {
    await this.heightInput.sendKeys(height);
  }
  async setWidthInput(width: string): Promise<void> {
    await this.widthInput.sendKeys(width);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class PhotoDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  titleInput = element.all(by.css('span')).get(2);

  descriptionInput = element.all(by.css('span')).get(3);

  imageInput = element.all(by.css('span')).get(4);

  heightInput = element.all(by.css('span')).get(5);

  widthInput = element.all(by.css('span')).get(6);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getImageInput(): Promise<string> {
    return await this.imageInput.getText();
  }

  async getHeightInput(): Promise<string> {
    return await this.heightInput.getText();
  }

  async getWidthInput(): Promise<string> {
    return await this.widthInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
