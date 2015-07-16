'use strict';

var _ = require('lodash');

module.exports = function (schema) {
  return traverseSchema(schema);
};

function traverseSchema (schema) {
  if (schema.type === 'object') {
    return _.mapValues(schema.properties, function (property) {
      return traverseSchema(property);
    });
  }

  if (schema.type === 'array' && !schema.example) {
    return [
      traverseSchema(schema.items)
    ];
  }

  return schema.example;
}
