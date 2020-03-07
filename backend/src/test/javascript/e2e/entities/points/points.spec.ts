import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PointsComponentsPage, { PointsDeleteDialog } from './points.page-object';
import PointsUpdatePage from './points-update.page-object';
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

describe('Points e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pointsComponentsPage: PointsComponentsPage;
  let pointsUpdatePage: PointsUpdatePage;
  let pointsDeleteDialog: PointsDeleteDialog;
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

  it('should load Points', async () => {
    await navBarPage.getEntityPage('points');
    pointsComponentsPage = new PointsComponentsPage();
    expect(await pointsComponentsPage.title.getText()).to.match(/Points/);

    expect(await pointsComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([pointsComponentsPage.noRecords, pointsComponentsPage.table]);

    beforeRecordsCount = (await isVisible(pointsComponentsPage.noRecords)) ? 0 : await getRecordsCount(pointsComponentsPage.table);
  });

  it('should load create Points page', async () => {
    await pointsComponentsPage.createButton.click();
    pointsUpdatePage = new PointsUpdatePage();
    expect(await pointsUpdatePage.getPageTitle().getAttribute('id')).to.match(/healthPointsApp.points.home.createOrEditLabel/);
    await pointsUpdatePage.cancel();
  });

  it('should create and save Points', async () => {
    await pointsComponentsPage.createButton.click();
    await pointsUpdatePage.setDateInput('01-01-2001');
    expect(await pointsUpdatePage.getDateInput()).to.eq('2001-01-01');
    await pointsUpdatePage.setExerciseInput('5');
    expect(await pointsUpdatePage.getExerciseInput()).to.eq('5');
    await pointsUpdatePage.setMealsInput('5');
    expect(await pointsUpdatePage.getMealsInput()).to.eq('5');
    await pointsUpdatePage.setAlcoholInput('5');
    expect(await pointsUpdatePage.getAlcoholInput()).to.eq('5');
    await pointsUpdatePage.setNotesInput('notes');
    expect(await pointsUpdatePage.getNotesInput()).to.match(/notes/);
    await pointsUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(pointsUpdatePage.saveButton);
    await pointsUpdatePage.save();
    await waitUntilHidden(pointsUpdatePage.saveButton);
    expect(await isVisible(pointsUpdatePage.saveButton)).to.be.false;

    expect(await pointsComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(pointsComponentsPage.table);

    await waitUntilCount(pointsComponentsPage.records, beforeRecordsCount + 1);
    expect(await pointsComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Points', async () => {
    const deleteButton = pointsComponentsPage.getDeleteButton(pointsComponentsPage.records.last());
    await click(deleteButton);

    pointsDeleteDialog = new PointsDeleteDialog();
    await waitUntilDisplayed(pointsDeleteDialog.deleteModal);
    expect(await pointsDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/healthPointsApp.points.delete.question/);
    await pointsDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(pointsDeleteDialog.deleteModal);

    expect(await isVisible(pointsDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([pointsComponentsPage.noRecords, pointsComponentsPage.table]);

    const afterCount = (await isVisible(pointsComponentsPage.noRecords)) ? 0 : await getRecordsCount(pointsComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
