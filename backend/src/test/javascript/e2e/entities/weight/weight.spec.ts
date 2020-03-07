import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import WeightComponentsPage, { WeightDeleteDialog } from './weight.page-object';
import WeightUpdatePage from './weight-update.page-object';
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

describe('Weight e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let weightComponentsPage: WeightComponentsPage;
  let weightUpdatePage: WeightUpdatePage;
  let weightDeleteDialog: WeightDeleteDialog;
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

  it('should load Weights', async () => {
    await navBarPage.getEntityPage('weight');
    weightComponentsPage = new WeightComponentsPage();
    expect(await weightComponentsPage.title.getText()).to.match(/Weights/);

    expect(await weightComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([weightComponentsPage.noRecords, weightComponentsPage.table]);

    beforeRecordsCount = (await isVisible(weightComponentsPage.noRecords)) ? 0 : await getRecordsCount(weightComponentsPage.table);
  });

  it('should load create Weight page', async () => {
    await weightComponentsPage.createButton.click();
    weightUpdatePage = new WeightUpdatePage();
    expect(await weightUpdatePage.getPageTitle().getAttribute('id')).to.match(/healthPointsApp.weight.home.createOrEditLabel/);
    await weightUpdatePage.cancel();
  });

  it('should create and save Weights', async () => {
    await weightComponentsPage.createButton.click();
    await weightUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await weightUpdatePage.getTimestampInput()).to.contain('2001-01-01T02:30');
    await weightUpdatePage.setWeightInput('5');
    expect(await weightUpdatePage.getWeightInput()).to.eq('5');
    await weightUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(weightUpdatePage.saveButton);
    await weightUpdatePage.save();
    await waitUntilHidden(weightUpdatePage.saveButton);
    expect(await isVisible(weightUpdatePage.saveButton)).to.be.false;

    expect(await weightComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(weightComponentsPage.table);

    await waitUntilCount(weightComponentsPage.records, beforeRecordsCount + 1);
    expect(await weightComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Weight', async () => {
    const deleteButton = weightComponentsPage.getDeleteButton(weightComponentsPage.records.last());
    await click(deleteButton);

    weightDeleteDialog = new WeightDeleteDialog();
    await waitUntilDisplayed(weightDeleteDialog.deleteModal);
    expect(await weightDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/healthPointsApp.weight.delete.question/);
    await weightDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(weightDeleteDialog.deleteModal);

    expect(await isVisible(weightDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([weightComponentsPage.noRecords, weightComponentsPage.table]);

    const afterCount = (await isVisible(weightComponentsPage.noRecords)) ? 0 : await getRecordsCount(weightComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
