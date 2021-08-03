import { Browser, Page } from 'puppeteer';
import * as dotenv from 'dotenv';

const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(pluginStealth());
dotenv.config();

(async () => {
    //sets browser options
    const browser = await puppeteerExtra.launch({ headless: true, slowMo: 50, args:[
        '--start-maximized' // you can also use '--start-fullscreen'
     ]});

    const url = 'https://www.audible.com/'
    const page = await browser.newPage();
    await page.goto(url);

    //Selectors
    await page.click('.ui-it-sign-in-link');
    await page.waitForSelector('#ap_email', { timeout: 5000 });
    await page.type('#ap_email', process.env.email);
    await page.type('#ap_password', process.env.password);

    await page.click('#signInSubmit');
    await page.waitForSelector('.bc-pub-block.ui-it-header-logo', { timeout: 5000 });
    console.log('Signed in');

    await page.goto('https://audible.com/library/titles');

    const bookData: any[] = [];

    const title = await page.$eval('.bc-text.bc-size-headline3', element => element.textContent);
    const author = await page.$eval('.bc-text.bc-size-callout', element => element.textContent);
    const image = await page.$eval('img', element => element.getAttribute('src'));
    const urlTitle = await page.$eval('.bc-list-item:nth-of-type(1) .bc-link.bc-color-base', element => element.getAttribute('href'));

    bookData.push({
        title: title.trim(),
        author: author.trim(),
        image: image,
        urlTitle: `https://audible.com${urlTitle}`,
        });


    console.log('bookData', bookData);
    await browser.close();


})();

