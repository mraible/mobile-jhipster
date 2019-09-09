import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import BloodPressureComponentsPage, { BloodPressureDeleteDialog } from './blood-pressure.page-object';
import BloodPressureUpdatePage from './blood-pressure-update.page-object';
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

describe('BloodPressure e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bloodPressureComponentsPage: BloodPressureComponentsPage;
  let bloodPressureUpdatePage: BloodPressureUpdatePage;
  let bloodPressureDeleteDialog: BloodPressureDeleteDialog;
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

  it('should load BloodPressures', async () => {
    await navBarPage.getEntityPage('blood-pressure');
    bloodPressureComponentsPage = new BloodPressureComponentsPage();
    expect(await bloodPressureComponentsPage.title.getText()).to.match(/Blood Pressures/);

    expect(await bloodPressureComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([bloodPressureComponentsPage.noRecords, bloodPressureComponentsPage.table]);

    beforeRecordsCount = (await isVisible(bloodPressureComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(bloodPressureComponentsPage.table);
  });

  it('should load create BloodPressure page', async () => {
    await bloodPressureComponentsPage.createButton.click();
    bloodPressureUpdatePage = new BloodPressureUpdatePage();
    expect(await bloodPressureUpdatePage.getPageTitle().getAttribute('id')).to.match(
      /healthPointsApp.bloodPressure.home.createOrEditLabel/
    );
    await bloodPressureUpdatePage.cancel();
  });

  it('should create and save BloodPressures', async () => {
    await bloodPressureComponentsPage.createButton.click();
    await bloodPressureUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await bloodPressureUpdatePage.getTimestampInput()).to.contain('2001-01-01T02:30');
    await bloodPressureUpdatePage.setSystolicInput('5');
    expect(await bloodPressureUpdatePage.getSystolicInput()).to.eq('5');
    await bloodPressureUpdatePage.setDiastolicInput('5');
    expect(await bloodPressureUpdatePage.getDiastolicInput()).to.eq('5');
    await bloodPressureUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(bloodPressureUpdatePage.saveButton);
    await bloodPressureUpdatePage.save();
    await waitUntilHidden(bloodPressureUpdatePage.saveButton);
    expect(await isVisible(bloodPressureUpdatePage.saveButton)).to.be.false;

    expect(await bloodPressureComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(bloodPressureComponentsPage.table);

    await waitUntilCount(bloodPressureComponentsPage.records, beforeRecordsCount + 1);
    expect(await bloodPressureComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last BloodPressure', async () => {
    const deleteButton = bloodPressureComponentsPage.getDeleteButton(bloodPressureComponentsPage.records.last());
    await click(deleteButton);

    bloodPressureDeleteDialog = new BloodPressureDeleteDialog();
    await waitUntilDisplayed(bloodPressureDeleteDialog.deleteModal);
    expect(await bloodPressureDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/healthPointsApp.bloodPressure.delete.question/);
    await bloodPressureDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(bloodPressureDeleteDialog.deleteModal);

    expect(await isVisible(bloodPressureDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([bloodPressureComponentsPage.noRecords, bloodPressureComponentsPage.table]);

    const afterCount = (await isVisible(bloodPressureComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(bloodPressureComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
