// @format
var request = require('request');
var bluebird = require('bluebird');
var path = require('path');
var penthouse = require('penthouse');
var fs = require('fs');
var tmpDir = require('os').tmpdir();
var extend = require('extend');

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

    request({uri: cssUrl, timeout: 10000})
      .on('error', callback)
      .pipe(fs.createWriteStream(tmpPath))
      .on('close', function() {
        penthouse(
          extend(options, {
            url: sourceUrl,
            css: tmpPath,
            phantomJsOptions: phantomJsOptions,
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
