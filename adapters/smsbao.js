"use strict";

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

module.exports = SMSBao;