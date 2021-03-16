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

describe('Weight Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToWeightScreen();
  });

  const navigateToWeightScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('weightEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('weightEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('weightScreen');
  };

  it('should allow you to create, update, and delete the Weight entity', async () => {
    await expect(element(by.id('weightScreen'))).toBeVisible();

    // create
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('weightEditScrollView');
    await scrollTo('timestampInput', 'weightEditScrollView');
    await setDateTimePickerValue('timestampInput', '2021-03-15T17:34:00-06:00', 'ISO8601');
    await scrollTo('weightInput', 'weightEditScrollView');
    await element(by.id('weightInput')).replaceText('3020');
    await element(by.id('weightEditScrollView')).swipe('down', 'slow');
    await scrollTo('submitButton', 'weightEditScrollView');
    await waitThenTapButton('submitButton');

    // view - validate the creation
    await waitForElementToBeVisibleById('weightDetailScrollView');
    await scrollTo('timestamp', 'weightDetailScrollView');
    const timestampCreateAttributes = await element(by.id('timestamp')).getAttributes();
    jestExpect(Date.parse(timestampCreateAttributes.label)).toEqual(Date.parse('2021-03-15T17:34:00-06:00'));
    await scrollTo('weight', 'weightDetailScrollView');
    await expect(element(by.id('weight'))).toHaveLabel('3020');

    // update
    await scrollTo('weightEditButton', 'weightDetailScrollView');
    await tapFirstElementByLabel('Weight Edit Button');
    await waitForElementToBeVisibleById('weightEditScrollView');
    await scrollTo('timestampInput', 'weightEditScrollView');
    await setDateTimePickerValue('timestampInput', '2021-03-15T22:45:00-06:00', 'ISO8601');
    await scrollTo('weightInput', 'weightEditScrollView');
    await element(by.id('weightInput')).replaceText('98531');
    await element(by.id('weightEditScrollView')).swipe('down', 'slow');
    await scrollTo('submitButton', 'weightEditScrollView');
    await waitThenTapButton('submitButton');

    // view - validate the update
    await waitForElementToBeVisibleById('weightDetailScrollView');
    await scrollTo('timestamp', 'weightDetailScrollView');
    const timestampUpdateAttributes = await element(by.id('timestamp')).getAttributes();
    jestExpect(Date.parse(timestampUpdateAttributes.label)).toEqual(Date.parse('2021-03-15T22:45:00-06:00'));
    await scrollTo('weight', 'weightDetailScrollView');
    await expect(element(by.id('weight'))).toHaveLabel('98531');

    // delete
    await scrollTo('weightDeleteButton', 'weightDetailScrollView');
    await tapFirstElementByLabel('Weight Delete Button');
    await waitForElementToBeVisibleById('weightDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('weightScreen');

    // logout
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
