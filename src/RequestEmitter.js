var EventEmitter = require('events');

class RequestEmitter extends EventEmitter {
  constructor(client) {
    super();

    client.on('message', function (_topic, params) {
      try {
        this.emit('request', JSON.parse(params));
      } catch (e) {
        this.emit('error', e, params);
      }
    }.bind(this));

    client.subscribe('critical-css:not-found');
  }
}

module.exports = RequestEmitter;
