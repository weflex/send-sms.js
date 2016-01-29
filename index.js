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

class SMSBao extends Adapter {
  constructor(credentials) {
    if (!credentials.user) {
      throw new TypeError('credentials.user is required');
    }
    if (!credentials.pass) {
      throw new TypeError('credentials.pass is required');
    }
    super('SMSBao', {
      endpoint: 'http://api.smsbao.com/sms',
      credentials
    });
  }
  request(phoneNum, content) {
    return request.get(url)
    .query({
      u: this.options.credentials.user,
      p: this.options.credentials.pass,
      m: phoneNum,  // phone number
      c: content    // text content
    })
    .then();
  }
}

exports.SMS = SMS;
exports.Adapter = Adapter;
exports.adapters = {
  SMSBao
};
