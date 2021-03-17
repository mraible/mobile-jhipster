const {
  reloadApp,
  loginAsUser,
  logout,
  goBack,
  tapFirstElementByLabel,
  openAndTapDrawerMenuItemByLabel,
  waitThenTapButton,
  waitForElementToBeVisibleById,
  setPickerValue,
  scrollTo,
} = require('../utils');

describe('Preferences Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToPreferencesScreen();
  });

  const navigateToPreferencesScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('preferencesEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('preferencesEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('preferencesScreen');
  };

  it('should allow you to create, update, and delete the Preferences entity', async () => {
    await expect(element(by.id('preferencesScreen'))).toBeVisible();

    // create
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('preferencesEditScrollView');
    await scrollTo('weeklyGoalInput', 'preferencesEditScrollView');
    await element(by.id('weeklyGoalInput')).replaceText('19');
    await scrollTo('weightUnitsInput', 'preferencesEditScrollView');
    await setPickerValue('weightUnitsInput', 'LB');
    await element(by.id('preferencesEditScrollView')).swipe('down', 'slow');
    await scrollTo('submitButton', 'preferencesEditScrollView');
    await waitThenTapButton('submitButton');

    // view - validate the creation
    await waitForElementToBeVisibleById('preferencesDetailScrollView');
    await scrollTo('weeklyGoal', 'preferencesDetailScrollView');
    await expect(element(by.id('weeklyGoal'))).toHaveLabel('19');
    await scrollTo('weightUnits', 'preferencesDetailScrollView');
    await expect(element(by.id('weightUnits'))).toHaveLabel('LB');

    // update
    await scrollTo('preferencesEditButton', 'preferencesDetailScrollView');
    await tapFirstElementByLabel('Preferences Edit Button');
    await waitForElementToBeVisibleById('preferencesEditScrollView');
    await scrollTo('weeklyGoalInput', 'preferencesEditScrollView');
    await element(by.id('weeklyGoalInput')).replaceText('14');
    await scrollTo('weightUnitsInput', 'preferencesEditScrollView');
    await setPickerValue('weightUnitsInput', 'KG');
    await element(by.id('preferencesEditScrollView')).swipe('down', 'slow');
    await scrollTo('submitButton', 'preferencesEditScrollView');
    await waitThenTapButton('submitButton');

    // view - validate the update
    await waitForElementToBeVisibleById('preferencesDetailScrollView');
    await scrollTo('weeklyGoal', 'preferencesDetailScrollView');
    await expect(element(by.id('weeklyGoal'))).toHaveLabel('14');
    await scrollTo('weightUnits', 'preferencesDetailScrollView');
    await expect(element(by.id('weightUnits'))).toHaveLabel('KG');

    // delete
    await scrollTo('preferencesDeleteButton', 'preferencesDetailScrollView');
    await tapFirstElementByLabel('Preferences Delete Button');
    await waitForElementToBeVisibleById('preferencesDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('preferencesScreen');

    // logout
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
