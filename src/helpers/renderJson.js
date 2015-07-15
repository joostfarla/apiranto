'use strict';

var hljs = require('highlight.js');

module.exports = function (object) {
  return hljs.highlight('json', JSON.stringify(object, null, 2)).value;
};
