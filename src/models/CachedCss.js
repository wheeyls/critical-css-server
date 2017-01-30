var extend = require('extend');

function CachedCss(client, finders) {
  this.client = client;
  this.finders = finders;
  this.attributes = extend({}, finders);
}

extend(CachedCss.prototype, {
  loaded: false,

  load: function () {
    var that = this;

    return new Promise(function (resolve) {
      if (that.loaded) {
        resolve(that.attributes);
      } else {
        that.client.hgetall(that.finders.key, function (err, value) {
          if (!value) {
            extend(that.attributes, { status: 'new' });
          } else {
            that.attributes = value;
          }

          that.loaded = true;
          resolve(that.attributes);
        });
      }
    });
  },

  save: function (attrs, cb) {
    if (attrs) { extend(this.attributes, attrs); }

    this.client.hmset(this.finders.key, this.flatAttributes(), function (err, value) {
      cb(err);
    });
  },

  createStub: function (cb) {
    this.save({ status: 'waiting' }, cb);
  },

  finish: function (content, cb) {
    this.save({ status: 'done', content: content }, cb);
  },

  toJSON: function () {
    return this.attributes;
  },

  flatAttributes: function () {
    var that = this;
    var results = [];

    Object.keys(this.attributes).forEach(function (key) {
      results.push(key);
      results.push(that.attributes[key]);
    });

    return results;
  }
});

module.exports = CachedCss;
