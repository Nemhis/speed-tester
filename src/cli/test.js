'use strict';

const fs = require(`fs`);
const program = require(`commander`);
const puppeteer = require(`puppeteer`);
const {mSecondToSeconds} = require(`../utility`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `test-result.json`;

const toUrl = (string) => new URL(string);

program
  .requiredOption(`--url <url>`, `Page url for test`, toUrl)
  .option(`--count <count>`, `Count test iteration`, 1)
  .option(`--headfull`, `Count test iteration`, false);

const processMetrics = (metrics) => ({
  dnsLookup: metrics.domainLookupEnd - metrics.domainLookupStart,
  tcpConnect: metrics.connectEnd - metrics.connectStart,
  request: metrics.responseStart - metrics.requestStart,
  response: metrics.responseEnd - metrics.responseStart,
  domLoaded: metrics.domComplete - metrics.domLoading,
  domInteractive: metrics.domInteractive - metrics.navigationStart,
  pageLoad: metrics.loadEventEnd - metrics.loadEventStart,
  fullTime: metrics.loadEventEnd - metrics.navigationStart
});

const metricsToSeconds = (metrics) => {
  const optimized = {};

  Object
    .keys(metrics)
    .forEach((metricName) => {
      optimized[metricName] = mSecondToSeconds(metrics[metricName]);
    });

  return optimized;
};

const metricsAvg = (metrics) => {
  const metricsSum = {};

  metrics.forEach((metric) => {
    Object
      .keys(metric)
      .forEach((metricName) => {
        if (!metricsSum[metricName]) {
          metricsSum[metricName] = 0;
        }

        metricsSum[metricName] += metric[metricName];
      });
  });

  Object
    .keys(metricsSum)
    .forEach((metricName) => {
      metricsSum[metricName] = metricsSum[metricName] / metrics.length;
    });

  return metricsSum;
};

async function test(url, count, pupeteerConfig) {
  const browser = await puppeteer.launch(pupeteerConfig);
  const metrics = [];

  for (let i = 0; i < count; i++) {
    const page = await browser.newPage(pupeteerConfig);
    await page.goto(url);

    const metricsJson = await page.evaluate(() => JSON.stringify(window.performance.timing));
    let metric = JSON.parse(metricsJson);
    metric = processMetrics(metric);

    metrics.push(metric);
  }

  browser.close();

  return metrics;
}

module.exports = {
  name: `--test`,
  run(args) {
    program.parse(args);
    let {url, count, headfull} = program.opts();
    count = parseInt(count, 10) || DEFAULT_COUNT;
    const pupeteerConfig = {
      headless: !headfull
    };

    test(url, count, pupeteerConfig)
      .then((metrics) => {
        let avgMetrics = metricsAvg(metrics);
        avgMetrics = metricsToSeconds(avgMetrics);
        const result = {
          url,
          count,
          avgMetrics,
          metrics,
        };

        fs.writeFile(FILE_NAME, JSON.stringify(result), (err) => {
          if (err) {
            throw new Error(`Can't write data to file...`);
          }

          return console.info(`Operation success. File created.`);
        });
      });
  }
};
