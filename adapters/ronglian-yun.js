"use strict";

const BaseAdapter = require('./base');
const crypto = require('crypto');
const moment = require('moment');
const request = require('superagent-promise')(
  require('superagent'), 
  Promise
);

const endpoints = {
  sandbox: 'https://sandboxapp.cloopen.com:8883',
  production: 'https://app.cloopen.com:8883'
};

class SMSBao extends BaseAdapter {
  constructor(credentials, env) {
    if (!credentials.sid) {
      throw new TypeError('credentials.sid is required');
    }
    if (!credentials.token) {
      throw new TypeError('credentials.token is required');
    }
    if (!credentials.appId) {
      throw new TypeError('credentials.appId is required');
    }
    super('SMSBao', {
      endpoint: endpoints[env || 'sandbox'],
      credentials
    });
  }
  request(phoneNum, content) {
    const timestamp = moment().format('yyyyMMddHHmmss');
    const signature = crypto.createHash('md5').update(
      this.options.sid + this.options.token + timestamp).toUpperCase();
    const authorization = new Buffer(this.options.sid + ':' + timestamp);
    const pathname = '/2013-12-26/Accounts/' + this.options.sid 
      + '/SMS/TemplateSMS?sig=' + signature;

    return request.post(this.options.endpoint + pathname)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', authorization)
    .send({
      to: phoneNum,
      appId: this.options.appId,
      templateId: content.templateId,
      datas: content.datas,
      data: content.data
    })
    .end();
  }
}

module.exports = SMSBao;