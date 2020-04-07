import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { WeightComponentsPage, WeightDetailPage, WeightUpdatePage } from './weight.po';

describe('Weight e2e test', () => {
  let loginPage: LoginPage;
  let weightComponentsPage: WeightComponentsPage;
  let weightUpdatePage: WeightUpdatePage;
  let weightDetailPage: WeightDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Weights';
  const SUBCOMPONENT_TITLE = 'Weight';
  let lastElement: any;
  let isVisible = false;

  const weight = '10';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await loginPage.login(username, password);
  });

  it('should load Weights', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Weight')
      .first()
      .click();

    weightComponentsPage = new WeightComponentsPage();
    await browser.wait(ec.visibilityOf(weightComponentsPage.title), 5000);
    expect(await weightComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(weightComponentsPage.entities.get(0)), ec.visibilityOf(weightComponentsPage.noResult)), 5000);
  });

  it('should create Weight', async () => {
    initNumberOfEntities = await weightComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(weightComponentsPage.createButton), 5000);
    await weightComponentsPage.clickOnCreateButton();
    weightUpdatePage = new WeightUpdatePage();
    await browser.wait(ec.visibilityOf(weightUpdatePage.pageTitle), 1000);
    expect(await weightUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await weightUpdatePage.setWeightInput(weight);

    await weightUpdatePage.save();
    await browser.wait(ec.visibilityOf(weightComponentsPage.title), 1000);
    expect(await weightComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await weightComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Weight', async () => {
    weightComponentsPage = new WeightComponentsPage();
    await browser.wait(ec.visibilityOf(weightComponentsPage.title), 5000);
    lastElement = await weightComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Weight', async () => {
    browser
      .executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if ((await lastElement.isEnabled()) && (await lastElement.isDisplayed())) {
          browser
            .executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last Weight', async () => {
    weightDetailPage = new WeightDetailPage();
    if (isVisible && (await weightDetailPage.pageTitle.isDisplayed())) {
      expect(await weightDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await weightDetailPage.getWeightInput()).toEqual(weight);
    }
  });

  it('should delete last Weight', async () => {
    weightDetailPage = new WeightDetailPage();
    if (isVisible && (await weightDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await weightDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(weightComponentsPage.title), 3000);
      expect(await weightComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await weightComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Weights tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
