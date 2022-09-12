// @format
var request = require('request');
var bluebird = require('bluebird');
var path = require('path');
var penthouse = require('penthouse');
var fs = require('fs');
var tmpDir = require('os').tmpdir();
var extend = require('extend');
var puppeteer = require('puppeteer') 
var tmpPath = path.join(tmpDir, 'crit.css');
var forced = [];

var defaultOptions = {forceInclude: forced, ignoreConsole: true};
var phantomJsOptions = {'ssl-protocol': 'any'};

var generate = bluebird.promisify(function(
  sourceUrl,
  cssUrl,
  options,
  callback,
) {
  try {
    options = extend({}, defaultOptions, options);

    request({uri: cssUrl, timeout: 10000, rejectUnauthorized:false})
      .on('error', callback)
      .pipe(fs.createWriteStream(tmpPath))
      .on('error', callback)
      .on('close', function() {

        const browserPromise = puppeteer.launch({
          ignoreHTTPSErrors: true,
          args: ['--disable-setuid-sandbox', '--no-sandbox'],
          // not required to specify here, but saves Penthouse some work if you will
          // re-use the same viewport for most penthouse calls.
          defaultViewport: {
            width: 1300,
            height: 900
          }
        })

        penthouse(
          extend(options, {
            url: sourceUrl,
            css: tmpPath,
            strict: true,
            phantomJsOptions: phantomJsOptions,
            puppeteer: {
              getBrowser: () => browserPromise,
              pageGotoOptions: {waitUntil: 'networkidle0'}
            }
          }),
        )
          .then(function(criticalCss) {
            callback(null, criticalCss);
          })
          .catch(callback);
      });
  } catch (err) {
    callback(err);
  }
});

module.exports = function() {
  var me;

  me = {generate: generate};

  return me;
};
