import { element, by, browser } from 'protractor';

import NavBarPage from '../../page-objects/navbar-page';
import SignInPage from '../../page-objects/signin-page';
import { waitUntilDisplayed } from '../../util/utils';

const expect = chai.expect;

describe('Administration', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth('admin', 'admin');
    await waitUntilDisplayed(navBarPage.adminMenu);
  });

  it('should load metrics', async () => {
    await navBarPage.clickOnAdminMenuItem('metrics');
    expect(await element(by.id('metrics-page-heading')).getText()).to.eq('Application Metrics');
  });

  it('should load health', async () => {
    await navBarPage.clickOnAdminMenuItem('health');
    expect(await element(by.id('health-page-heading')).getText()).to.eq('Health Checks');
  });

  it('should load configuration', async () => {
    await navBarPage.clickOnAdminMenuItem('configuration');
    expect(await element(by.id('configuration-page-heading')).getText()).to.eq('Configuration');
  });

  it('should load audits', async () => {
    await navBarPage.clickOnAdminMenuItem('audits');
    expect(await element(by.id('audits-page-heading')).getText()).to.eq('Audits');
  });

  it('should load logs', async () => {
    await navBarPage.clickOnAdminMenuItem('logs');
    expect(await element(by.id('logs-page-heading')).getText()).to.eq('Logs');
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
