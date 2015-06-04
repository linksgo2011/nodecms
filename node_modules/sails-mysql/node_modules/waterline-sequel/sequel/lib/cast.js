/**
 * Cast special values to proper types.
 *
 * Ex: Array is stored as "[0,1,2,3]" and should be cast to proper
 * array for return values.
 */

Query.prototype.cast = function(values) {
  var self = this;
  var _values = _.clone(values);

  Object.keys(values).forEach(function(key) {
    self.castValue(key, _values[key], _values, self._schema);
  });

  return _values;
};

/**
 * Cast a value
 *
 * @param {String} key
 * @param {Object|String|Integer|Array} value
 * @param {Object} schema
 * @api private
 */

Query.prototype.castValue = function(key, value, attributes, schema, joinKey) {

  // Check if key is a special "join" key, identified with a '__' split
  var attr = key.split('__');
  if(attr.length === 2) {

    // Find schema
    if(this._tableDefs) {
      var joinSchema = this._tableDefs[attr[0]];
      if(joinSchema) return this.castValue(attr[1], value, attributes, joinSchema.definition, key);
    }
  }

  // Lookup Schema "Type"
  if(!schema[key]) return;
  var type = schema[key].type;
  if(!type) return;

  // Attempt to parse Array
  if(type === 'array') {
    try {
      if(joinKey) attributes[joinKey] = JSON.parse(value);
      else attributes[key] = JSON.parse(value);
    } catch(e) {
      return;
    }
  }
};
