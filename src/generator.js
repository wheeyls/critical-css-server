var request     = require('request');
var bluebird    = require('bluebird');
var path        = require('path');
var criticalcss = require('criticalcss');
var penthouse   = require('penthouse');
var fs          = require('fs');
var tmpDir      = require('os').tmpdir();
var extend      = require('extend');

var tmpPath = path.join(tmpDir, 'crit.css');
var forced = ['.is-logged-in', '.is-logged-out', '.right-off-canvas-menu'];

module.exports = function () {
  var me;

  me = {
    generate: bluebird.promisify(function (sourceUrl, cssUrl, options, callback) {
      try {
        options = extend({ forceInclude: forced, ignoreConsole: true }, options);

        request(cssUrl).pipe(fs.createWriteStream(tmpPath)).on('close', function() {
          penthouse({
            url: sourceUrl,
            css: tmpPath
          }).
          then(function(criticalCss){
            console.log('DONE');
            console.log(criticalCss);
            callback(null, criticalCss);
          }).
          catch(function(err){
            console.log(err);
            callback(err);
          });
        });
      } catch (err) {
        callback(err);
      }
    })
  };

  return me;
};
