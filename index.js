"use strict";

const request = require('superagent-promise')(
  require('superagent'), 
  Promise
);

class SMS {
  constructor(name, adapter) {
    if (typeof name !== 'string') {
      throw new TypeError('name is required to be a string');
    }
    if (!(adapter instanceof Adapter)) {
      throw new TypeError('adapter must be an instance of Adapter');
    }
    this.name = name;
    this.adapter = adapter;
  }
  send(phoneNum, text) {
    return this.adapter.request(
      phoneNum,
      `【${this.name}】${text}`
    );
  }
}

class Adapter {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }
  request() {
    throw new Error('not implemented');
  }
}

exports.SMS = SMS;
exports.Adapter = Adapter;
exports.adapters = {
  SMSBao: require('./adapters/smsbao.js')
};
