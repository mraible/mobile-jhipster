const jestExpect = require('expect');
const {
  reloadApp,
  loginAsUser,
  logout,
  goBack,
  tapFirstElementByLabel,
  openAndTapDrawerMenuItemByLabel,
  waitThenTapButton,
  waitForElementToBeVisibleById,
  setDateTimePickerValue,
  scrollTo,
} = require('../utils');

describe('Points Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToPointsScreen();
  });

  const navigateToPointsScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('pointsEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('pointsEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('pointsScreen');
  };

  it('should allow you to create, update, and delete the Points entity', async () => {
    await expect(element(by.id('pointsScreen'))).toBeVisible();

    // create
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('pointsEditScrollView');
    await scrollTo('dateInput', 'pointsEditScrollView');
    await setDateTimePickerValue('dateInput', '03/14/21', 'MM/dd/yy');
    await scrollTo('exerciseInput', 'pointsEditScrollView');
    await element(by.id('exerciseInput')).replaceText('31286');
    await scrollTo('mealsInput', 'pointsEditScrollView');
    await element(by.id('mealsInput')).replaceText('84497');
    await scrollTo('alcoholInput', 'pointsEditScrollView');
    await element(by.id('alcoholInput')).replaceText('37581');
    await scrollTo('notesInput', 'pointsEditScrollView');
    await element(by.id('notesInput')).replaceText('transmitting models');
    await element(by.id('pointsEditScrollView')).swipe('down', 'slow');
    await scrollTo('submitButton', 'pointsEditScrollView');
    await waitThenTapButton('submitButton');

    // view - validate the creation
    await waitForElementToBeVisibleById('pointsDetailScrollView');
    await scrollTo('date', 'pointsDetailScrollView');
    const dateCreateAttributes = await element(by.id('date')).getAttributes();
    jestExpect(Date.parse(dateCreateAttributes.label)).toEqual(Date.parse('03/14/21'));
    await scrollTo('exercise', 'pointsDetailScrollView');
    await expect(element(by.id('exercise'))).toHaveLabel('31286');
    await scrollTo('meals', 'pointsDetailScrollView');
    await expect(element(by.id('meals'))).toHaveLabel('84497');
    await scrollTo('alcohol', 'pointsDetailScrollView');
    await expect(element(by.id('alcohol'))).toHaveLabel('37581');
    await scrollTo('notes', 'pointsDetailScrollView');
    await expect(element(by.id('notes'))).toHaveLabel('transmitting models');

    // update
    await scrollTo('pointsEditButton', 'pointsDetailScrollView');
    await tapFirstElementByLabel('Points Edit Button');
    await waitForElementToBeVisibleById('pointsEditScrollView');
    await scrollTo('dateInput', 'pointsEditScrollView');
    await setDateTimePickerValue('dateInput', '03/14/21', 'MM/dd/yy');
    await scrollTo('exerciseInput', 'pointsEditScrollView');
    await element(by.id('exerciseInput')).replaceText('53113');
    await scrollTo('mealsInput', 'pointsEditScrollView');
    await element(by.id('mealsInput')).replaceText('54722');
    await scrollTo('alcoholInput', 'pointsEditScrollView');
    await element(by.id('alcoholInput')).replaceText('93107');
    await scrollTo('notesInput', 'pointsEditScrollView');
    await element(by.id('notesInput')).replaceText('transmitting models');
    await element(by.id('pointsEditScrollView')).swipe('down', 'slow');
    await scrollTo('submitButton', 'pointsEditScrollView');
    await waitThenTapButton('submitButton');

    // view - validate the update
    await waitForElementToBeVisibleById('pointsDetailScrollView');
    await scrollTo('date', 'pointsDetailScrollView');
    const dateUpdateAttributes = await element(by.id('date')).getAttributes();
    jestExpect(Date.parse(dateUpdateAttributes.label)).toEqual(Date.parse('03/14/21'));
    await scrollTo('exercise', 'pointsDetailScrollView');
    await expect(element(by.id('exercise'))).toHaveLabel('53113');
    await scrollTo('meals', 'pointsDetailScrollView');
    await expect(element(by.id('meals'))).toHaveLabel('54722');
    await scrollTo('alcohol', 'pointsDetailScrollView');
    await expect(element(by.id('alcohol'))).toHaveLabel('93107');
    await scrollTo('notes', 'pointsDetailScrollView');
    await expect(element(by.id('notes'))).toHaveLabel('transmitting models');

    // delete
    await scrollTo('pointsDeleteButton', 'pointsDetailScrollView');
    await tapFirstElementByLabel('Points Delete Button');
    await waitForElementToBeVisibleById('pointsDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('pointsScreen');

    // logout
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
