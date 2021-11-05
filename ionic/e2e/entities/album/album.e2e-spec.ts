import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { AlbumComponentsPage, AlbumDetailPage, AlbumUpdatePage } from './album.po';

describe('Album e2e test', () => {
  let loginPage: LoginPage;
  let albumComponentsPage: AlbumComponentsPage;
  let albumUpdatePage: AlbumUpdatePage;
  let albumDetailPage: AlbumDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Albums';
  const SUBCOMPONENT_TITLE = 'Album';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const title = 'title';
  const description = 'description';

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

  it('should load Albums', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Album')
      .first()
      .click();

    albumComponentsPage = new AlbumComponentsPage();
    await browser.wait(ec.visibilityOf(albumComponentsPage.title), 5000);
    expect(await albumComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(albumComponentsPage.entities.get(0)), ec.visibilityOf(albumComponentsPage.noResult)), 5000);
  });

  it('should create Album', async () => {
    initNumberOfEntities = await albumComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(albumComponentsPage.createButton), 5000);
    await albumComponentsPage.clickOnCreateButton();
    albumUpdatePage = new AlbumUpdatePage();
    await browser.wait(ec.visibilityOf(albumUpdatePage.pageTitle), 3000);
    expect(await albumUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await albumUpdatePage.setTitleInput(title);
    await albumUpdatePage.setDescriptionInput(description);

    await albumUpdatePage.save();
    await browser.wait(ec.visibilityOf(albumComponentsPage.title), 3000);
    expect(await albumComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await albumComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Album', async () => {
    albumComponentsPage = new AlbumComponentsPage();
    await browser.wait(ec.visibilityOf(albumComponentsPage.title), 5000);
    lastElement = await albumComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Album', async () => {
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

  it('should view the last Album', async () => {
    albumDetailPage = new AlbumDetailPage();
    if (isVisible && (await albumDetailPage.pageTitle.isDisplayed())) {
      expect(await albumDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await albumDetailPage.getIdInput()).toEqual(id);

      expect(await albumDetailPage.getTitleInput()).toEqual(title);

      expect(await albumDetailPage.getDescriptionInput()).toEqual(description);
    }
  });

  it('should delete last Album', async () => {
    albumDetailPage = new AlbumDetailPage();
    if (isVisible && (await albumDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await albumDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(albumComponentsPage.title), 3000);
      expect(await albumComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await albumComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Albums tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
