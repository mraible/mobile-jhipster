import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PreferencesComponentsPage, { PreferencesDeleteDialog } from './preferences.page-object';
import PreferencesUpdatePage from './preferences-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';

const expect = chai.expect;

describe('Preferences e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let preferencesComponentsPage: PreferencesComponentsPage;
  let preferencesUpdatePage: PreferencesUpdatePage;
  let preferencesDeleteDialog: PreferencesDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth('admin', 'admin');
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Preferences', async () => {
    await navBarPage.getEntityPage('preferences');
    preferencesComponentsPage = new PreferencesComponentsPage();
    expect(await preferencesComponentsPage.title.getText()).to.match(/Preferences/);

    expect(await preferencesComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([preferencesComponentsPage.noRecords, preferencesComponentsPage.table]);

    beforeRecordsCount = (await isVisible(preferencesComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(preferencesComponentsPage.table);
  });

  it('should load create Preferences page', async () => {
    await preferencesComponentsPage.createButton.click();
    preferencesUpdatePage = new PreferencesUpdatePage();
    expect(await preferencesUpdatePage.getPageTitle().getAttribute('id')).to.match(/healthPointsApp.preferences.home.createOrEditLabel/);
    await preferencesUpdatePage.cancel();
  });

  it('should create and save Preferences', async () => {
    await preferencesComponentsPage.createButton.click();
    await preferencesUpdatePage.setWeeklyGoalInput('5');
    expect(await preferencesUpdatePage.getWeeklyGoalInput()).to.eq('5');
    await preferencesUpdatePage.weightUnitsSelectLastOption();
    await preferencesUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(preferencesUpdatePage.saveButton);
    await preferencesUpdatePage.save();
    await waitUntilHidden(preferencesUpdatePage.saveButton);
    expect(await isVisible(preferencesUpdatePage.saveButton)).to.be.false;

    expect(await preferencesComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(preferencesComponentsPage.table);

    await waitUntilCount(preferencesComponentsPage.records, beforeRecordsCount + 1);
    expect(await preferencesComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Preferences', async () => {
    const deleteButton = preferencesComponentsPage.getDeleteButton(preferencesComponentsPage.records.last());
    await click(deleteButton);

    preferencesDeleteDialog = new PreferencesDeleteDialog();
    await waitUntilDisplayed(preferencesDeleteDialog.deleteModal);
    expect(await preferencesDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/healthPointsApp.preferences.delete.question/);
    await preferencesDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(preferencesDeleteDialog.deleteModal);

    expect(await isVisible(preferencesDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([preferencesComponentsPage.noRecords, preferencesComponentsPage.table]);

    const afterCount = (await isVisible(preferencesComponentsPage.noRecords)) ? 0 : await getRecordsCount(preferencesComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
