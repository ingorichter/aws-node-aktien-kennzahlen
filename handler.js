const puppeteer = require('puppeteer');
const { getChrome } = require('./chrome-script');
const scraper = require("./scraper");

module.exports.extract = async (event) => {
  const { url } = event.queryStringParameters;
  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const content = await scraper.scrape(page);

  return {
    statusCode: 200,
    body: JSON.stringify({
      content
    })
  };
};
