import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  PreferencesComponentsPage,
      PreferencesDetailPage,
      PreferencesUpdatePage
} from './preferences.po';

describe('Preferences e2e test', () => {

  let loginPage: LoginPage;
  let preferencesComponentsPage: PreferencesComponentsPage;
  let preferencesUpdatePage: PreferencesUpdatePage;
  let preferencesDetailPage: PreferencesDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Preferences';
  const SUBCOMPONENT_TITLE = 'Preferences';
  let lastElement: any;
  let isVisible = false;

  const weeklyGoal = '5';
  
  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await loginPage.login(username, password);

  });

  it('should load Preferences', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element.all(by.css('ion-item'))
      .filter(async el => (await el.element(by.css('h2')).getText()) === 'Preferences').first().click();

    preferencesComponentsPage = new PreferencesComponentsPage();
    await browser.wait(ec.visibilityOf(preferencesComponentsPage.title), 5000);
    expect(await preferencesComponentsPage.getTitle())
      .toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(preferencesComponentsPage.entities.get(0)), ec.visibilityOf(preferencesComponentsPage.noResult)), 5000);
  });

  it('should create Preferences', async () => {
    initNumberOfEntities = await preferencesComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(preferencesComponentsPage.createButton), 5000);
    await preferencesComponentsPage.clickOnCreateButton();
    preferencesUpdatePage = new PreferencesUpdatePage();
    await browser.wait(ec.visibilityOf(preferencesUpdatePage.pageTitle), 1000);
    expect(await preferencesUpdatePage.getPageTitle())
      .toEqual(SUBCOMPONENT_TITLE);

    await preferencesUpdatePage.setWeeklyGoalInput(weeklyGoal);
    await preferencesUpdatePage.weightUnitsSelectLastOption();

    await preferencesUpdatePage.save();
    await browser.wait(ec.visibilityOf(preferencesComponentsPage.title), 1000);
    expect(await preferencesComponentsPage.getTitle())
      .toEqual(COMPONENT_TITLE);
    expect(await preferencesComponentsPage.getEntitiesNumber())
      .toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Preferences', async () => {
    preferencesComponentsPage = new PreferencesComponentsPage();
    await browser.wait(ec.visibilityOf(preferencesComponentsPage.title), 5000);
    lastElement = await preferencesComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Preferences', async () => {
    browser.executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if (await lastElement.isEnabled() && await lastElement.isDisplayed()) {
          browser.executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last Preferences', async () => {
    preferencesDetailPage = new PreferencesDetailPage();
    if (isVisible && await preferencesDetailPage.pageTitle.isDisplayed()) {
    expect(await preferencesDetailPage.getPageTitle())
      .toEqual(SUBCOMPONENT_TITLE);


    expect(await preferencesDetailPage.getWeeklyGoalInput()).toEqual(weeklyGoal);

    }
  });

  it('should delete last Preferences', async () => {
    preferencesDetailPage = new PreferencesDetailPage();
    if (isVisible && await preferencesDetailPage.deleteButton.isDisplayed()) {
    await browser.executeScript('arguments[0].click()', await preferencesDetailPage.deleteButton.getWebElement());

    const alertConfirmButton = element.all(by.className('alert-button')).last();

    await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
    alertConfirmButton.click();
    await browser.wait(ec.visibilityOf(preferencesComponentsPage.title), 3000);
    expect(await preferencesComponentsPage.getTitle())
      .toEqual(COMPONENT_TITLE);
    expect(await preferencesComponentsPage.getEntitiesNumber())
      .toEqual(initNumberOfEntities);
    }
  });


  it('finish Preferences tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
