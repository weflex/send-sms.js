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
    const credentials = this.options.credentials;
    const timestamp = moment().format('YYYYMMDDhhmmss');
    const signature = crypto.createHash('md5').update(
      credentials.sid + credentials.token + timestamp).digest('hex').toUpperCase();
    const authorization = new Buffer(credentials.sid + ':' + timestamp).toString('base64');
    const pathname = '/2013-12-26/Accounts/' + credentials.sid 
      + '/SMS/TemplateSMS?sig=' + signature;

    return request.post(this.options.endpoint + pathname)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', authorization)
    .send({
      to: phoneNum,
      appId: credentials.appId,
      templateId: content.templateId,
      datas: content.datas,
      data: content.data
    })
    .end();
  }
}

module.exports = SMSBao;