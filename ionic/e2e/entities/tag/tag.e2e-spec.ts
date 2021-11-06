import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { TagComponentsPage, TagDetailPage, TagUpdatePage } from './tag.po';

describe('Tag e2e test', () => {
  let loginPage: LoginPage;
  let tagComponentsPage: TagComponentsPage;
  let tagUpdatePage: TagUpdatePage;
  let tagDetailPage: TagDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Tags';
  const SUBCOMPONENT_TITLE = 'Tag';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await browser.sleep(1000);
    await browser.wait(ec.visibilityOf(loginPage.signInButton), 3000);
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await loginPage.login(username, password);
  });

  it('should load Tags', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Tag')
      .first()
      .click();

    tagComponentsPage = new TagComponentsPage();
    await browser.wait(ec.visibilityOf(tagComponentsPage.title), 5000);
    expect(await tagComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(tagComponentsPage.entities.get(0)), ec.visibilityOf(tagComponentsPage.noResult)), 5000);
  });

  it('should create Tag', async () => {
    initNumberOfEntities = await tagComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(tagComponentsPage.createButton), 5000);
    await tagComponentsPage.clickOnCreateButton();
    tagUpdatePage = new TagUpdatePage();
    await browser.wait(ec.visibilityOf(tagUpdatePage.pageTitle), 3000);
    expect(await tagUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await tagUpdatePage.setNameInput(name);

    await tagUpdatePage.save();
    await browser.wait(ec.visibilityOf(tagComponentsPage.title), 3000);
    expect(await tagComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await tagComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Tag', async () => {
    tagComponentsPage = new TagComponentsPage();
    await browser.wait(ec.visibilityOf(tagComponentsPage.title), 5000);
    lastElement = await tagComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Tag', async () => {
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

  it('should view the last Tag', async () => {
    tagDetailPage = new TagDetailPage();
    if (isVisible && (await tagDetailPage.pageTitle.isDisplayed())) {
      expect(await tagDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await tagDetailPage.getIdInput()).toEqual(id);

      expect(await tagDetailPage.getNameInput()).toEqual(name);
    }
  });

  it('should delete last Tag', async () => {
    tagDetailPage = new TagDetailPage();
    if (isVisible && (await tagDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await tagDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(tagComponentsPage.title), 3000);
      expect(await tagComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await tagComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Tags tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
