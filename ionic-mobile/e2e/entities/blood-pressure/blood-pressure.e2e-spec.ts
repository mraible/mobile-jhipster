import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { BloodPressureComponentsPage, BloodPressureDetailPage, BloodPressureUpdatePage } from './blood-pressure.po';

describe('BloodPressure e2e test', () => {
  let loginPage: LoginPage;
  let bloodPressureComponentsPage: BloodPressureComponentsPage;
  let bloodPressureUpdatePage: BloodPressureUpdatePage;
  let bloodPressureDetailPage: BloodPressureDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Blood Pressures';
  const SUBCOMPONENT_TITLE = 'Blood Pressure';
  let lastElement: any;
  let isVisible = false;

  const systolic = '5';
  const diastolic = '5';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await loginPage.login(username, password);
  });

  it('should load BloodPressures', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'BloodPressure')
      .first()
      .click();

    bloodPressureComponentsPage = new BloodPressureComponentsPage();
    //console.log(element.all(by.css('ion-title0')).get(0));

    await browser.wait(ec.visibilityOf(bloodPressureComponentsPage.title), 5000);
    expect(await bloodPressureComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(bloodPressureComponentsPage.entities.get(0)), ec.visibilityOf(bloodPressureComponentsPage.noResult)),
      5000
    );
  });

  it('should create BloodPressure', async () => {
    initNumberOfEntities = await bloodPressureComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(bloodPressureComponentsPage.createButton), 5000);
    await bloodPressureComponentsPage.clickOnCreateButton();
    bloodPressureUpdatePage = new BloodPressureUpdatePage();
    await browser.wait(ec.visibilityOf(bloodPressureUpdatePage.pageTitle), 1000);
    expect(await bloodPressureUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await bloodPressureUpdatePage.setSystolicInput(systolic);
    await bloodPressureUpdatePage.setDiastolicInput(diastolic);

    await bloodPressureUpdatePage.save();
    await browser.wait(ec.visibilityOf(bloodPressureComponentsPage.title), 1000);
    expect(await bloodPressureComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await bloodPressureComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last BloodPressure', async () => {
    bloodPressureComponentsPage = new BloodPressureComponentsPage();
    await browser.wait(ec.visibilityOf(bloodPressureComponentsPage.title), 5000);
    lastElement = await bloodPressureComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last BloodPressure', async () => {
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

  it('should view the last BloodPressure', async () => {
    bloodPressureDetailPage = new BloodPressureDetailPage();
    if (isVisible && (await bloodPressureDetailPage.pageTitle.isDisplayed())) {
      expect(await bloodPressureDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await bloodPressureDetailPage.getSystolicInput()).toEqual(systolic);

      expect(await bloodPressureDetailPage.getDiastolicInput()).toEqual(diastolic);
    }
  });

  it('should delete last BloodPressure', async () => {
    bloodPressureDetailPage = new BloodPressureDetailPage();
    if (isVisible && (await bloodPressureDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await bloodPressureDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(bloodPressureComponentsPage.title), 3000);
      expect(await bloodPressureComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await bloodPressureComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish BloodPressures tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
