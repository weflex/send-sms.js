"use strict";

class Adapter {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }
  request() {
    throw new Error('not implemented');
  }
}

module.exports = Adapter;
