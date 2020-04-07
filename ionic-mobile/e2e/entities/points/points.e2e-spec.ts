import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PointsComponentsPage, PointsDetailPage, PointsUpdatePage } from './points.po';

describe('Points e2e test', () => {
  let loginPage: LoginPage;
  let pointsComponentsPage: PointsComponentsPage;
  let pointsUpdatePage: PointsUpdatePage;
  let pointsDetailPage: PointsDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Points';
  const SUBCOMPONENT_TITLE = 'Points';
  let lastElement: any;
  let isVisible = false;

  const exercise = '10';
  const meals = '10';
  const alcohol = '10';
  const notes = 'notes';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await loginPage.login(username, password);
  });

  it('should load Points', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Points')
      .first()
      .click();

    pointsComponentsPage = new PointsComponentsPage();
    await browser.wait(ec.visibilityOf(pointsComponentsPage.title), 5000);
    expect(await pointsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(pointsComponentsPage.entities.get(0)), ec.visibilityOf(pointsComponentsPage.noResult)), 5000);
  });

  it('should create Points', async () => {
    initNumberOfEntities = await pointsComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(pointsComponentsPage.createButton), 5000);
    await pointsComponentsPage.clickOnCreateButton();
    pointsUpdatePage = new PointsUpdatePage();
    await browser.wait(ec.visibilityOf(pointsUpdatePage.pageTitle), 1000);
    expect(await pointsUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await pointsUpdatePage.setExerciseInput(exercise);
    await pointsUpdatePage.setMealsInput(meals);
    await pointsUpdatePage.setAlcoholInput(alcohol);
    await pointsUpdatePage.setNotesInput(notes);

    await pointsUpdatePage.save();
    await browser.wait(ec.visibilityOf(pointsComponentsPage.title), 1000);
    expect(await pointsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await pointsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Points', async () => {
    pointsComponentsPage = new PointsComponentsPage();
    await browser.wait(ec.visibilityOf(pointsComponentsPage.title), 5000);
    lastElement = await pointsComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Points', async () => {
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

  it('should view the last Points', async () => {
    pointsDetailPage = new PointsDetailPage();
    if (isVisible && (await pointsDetailPage.pageTitle.isDisplayed())) {
      expect(await pointsDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await pointsDetailPage.getExerciseInput()).toEqual(exercise);

      expect(await pointsDetailPage.getMealsInput()).toEqual(meals);

      expect(await pointsDetailPage.getAlcoholInput()).toEqual(alcohol);

      expect(await pointsDetailPage.getNotesInput()).toEqual(notes);
    }
  });

  it('should delete last Points', async () => {
    pointsDetailPage = new PointsDetailPage();
    if (isVisible && (await pointsDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await pointsDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(pointsComponentsPage.title), 3000);
      expect(await pointsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await pointsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Points tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
