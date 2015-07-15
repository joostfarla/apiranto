'use strict';

var _ = require('lodash');

module.exports = function (schema) {
  return traverseSchema(schema);
};

function traverseSchema (schema) {
  if (schema.type === 'object') {
    var result = {};

    _.forEach(schema.properties, function (property, key) {
      result[key] = traverseSchema(property);
    });

    return result;
  }

  if (schema.type === 'array') {
    if (schema.example) {
      return schema.example;
    }

    return [
      traverseSchema(schema.items)
    ];
  }

  return schema.example;
}
