// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const puppeteer = require('puppeteer');
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu');
      return launchOptions;
    }
  });
  on('task', {
    login({ baseUrl, username, password }) {
      return (async () => {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          devtools: false,
          ignoreHTTPSErrors: true,
          headless: true,
        });

        const page = await browser.newPage();

        await page.goto(`${baseUrl}oauth2/authorization/oidc`, {
          // The app redirects to the login-page
          waitUntil: 'networkidle2', // Wait until login-page has been reached
        });

        await page.waitForSelector('[name="username"]');
        await page.waitForSelector('[name="password"]');
        await page.waitForSelector('input[type="submit"]');
        await page.type('[name="username"]', username);
        await page.type('[name="password"]', password);
        await page.click('input[type="submit"]');

        await page.waitForNavigation({ waitUntil: 'networkidle2' }); // Wait until redirected back to the app

        const authCookies = await page.cookies();

        browser.close();
        return authCookies;
      })();
    },
    logout(baseUrl) {
      return async () => {
        const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
        const page = await browser.newPage();
        await page.goto(`${baseUrl}api/logout`, {
          waitUntil: 'networkidle2',
        });
        return true;
      };
    },
  });
};
