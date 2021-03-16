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

describe('BloodPressure Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToBloodPressureScreen();
  });

  const navigateToBloodPressureScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('bloodPressureEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('bloodPressureEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('bloodPressureScreen');
  };

  it('should allow you to create, update, and delete the BloodPressure entity', async () => {
    await expect(element(by.id('bloodPressureScreen'))).toBeVisible();

    // create
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('bloodPressureEditScrollView');
    await scrollTo('timestampInput', 'bloodPressureEditScrollView');
    await setDateTimePickerValue('timestampInput', '2021-03-15T03:41:00-06:00', 'ISO8601');
    await scrollTo('systolicInput', 'bloodPressureEditScrollView');
    await element(by.id('systolicInput')).replaceText('28799');
    await scrollTo('diastolicInput', 'bloodPressureEditScrollView');
    await element(by.id('diastolicInput')).replaceText('97784');
    await element(by.id('bloodPressureEditScrollView')).swipe('down', 'slow');
    await scrollTo('submitButton', 'bloodPressureEditScrollView');
    await waitThenTapButton('submitButton');

    // view - validate the creation
    await waitForElementToBeVisibleById('bloodPressureDetailScrollView');
    await scrollTo('timestamp', 'bloodPressureDetailScrollView');
    const timestampCreateAttributes = await element(by.id('timestamp')).getAttributes();
    jestExpect(Date.parse(timestampCreateAttributes.label)).toEqual(Date.parse('2021-03-15T03:41:00-06:00'));
    await scrollTo('systolic', 'bloodPressureDetailScrollView');
    await expect(element(by.id('systolic'))).toHaveLabel('28799');
    await scrollTo('diastolic', 'bloodPressureDetailScrollView');
    await expect(element(by.id('diastolic'))).toHaveLabel('97784');

    // update
    await scrollTo('bloodPressureEditButton', 'bloodPressureDetailScrollView');
    await tapFirstElementByLabel('BloodPressure Edit Button');
    await waitForElementToBeVisibleById('bloodPressureEditScrollView');
    await scrollTo('timestampInput', 'bloodPressureEditScrollView');
    await setDateTimePickerValue('timestampInput', '2021-03-16T01:06:00-06:00', 'ISO8601');
    await scrollTo('systolicInput', 'bloodPressureEditScrollView');
    await element(by.id('systolicInput')).replaceText('682');
    await scrollTo('diastolicInput', 'bloodPressureEditScrollView');
    await element(by.id('diastolicInput')).replaceText('39101');
    await element(by.id('bloodPressureEditScrollView')).swipe('down', 'slow');
    await scrollTo('submitButton', 'bloodPressureEditScrollView');
    await waitThenTapButton('submitButton');

    // view - validate the update
    await waitForElementToBeVisibleById('bloodPressureDetailScrollView');
    await scrollTo('timestamp', 'bloodPressureDetailScrollView');
    const timestampUpdateAttributes = await element(by.id('timestamp')).getAttributes();
    jestExpect(Date.parse(timestampUpdateAttributes.label)).toEqual(Date.parse('2021-03-16T01:06:00-06:00'));
    await scrollTo('systolic', 'bloodPressureDetailScrollView');
    await expect(element(by.id('systolic'))).toHaveLabel('682');
    await scrollTo('diastolic', 'bloodPressureDetailScrollView');
    await expect(element(by.id('diastolic'))).toHaveLabel('39101');

    // delete
    await scrollTo('bloodPressureDeleteButton', 'bloodPressureDetailScrollView');
    await tapFirstElementByLabel('BloodPressure Delete Button');
    await waitForElementToBeVisibleById('bloodPressureDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('bloodPressureScreen');

    // logout
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
