var request = require('request');
var path = require( 'path' );
var criticalcss = require('criticalcss');
var fs = require('fs');
var tmpDir = require('os').tmpdir();
var extend = require('extend');

var tmpPath = path.join(tmpDir, 'crit.css');
var forced = ['.is-logged-in', '.is-logged-out', '.right-off-canvas-menu'];

module.exports = function () {
  var me;

  me = {
    generate: function (sourceUrl, cssUrl, options, callback) {
      options = extend({ forceInclude: forced, ignoreConsole: true }, options);

      request(cssUrl).pipe(fs.createWriteStream(tmpPath)).on('close', function() {
        criticalcss.getRules(tmpPath, function(err, output) {
          if (err) {
            callback(err);
          } else {
            criticalcss.findCritical(sourceUrl, extend({ rules: JSON.parse(output) }, options), callback);
          }
        });
      });
    }
  };

  return me;
};
