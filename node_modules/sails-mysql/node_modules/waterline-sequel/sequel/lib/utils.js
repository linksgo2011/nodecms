/**
 * Helper functions
 */

var _ = require('lodash');

// Module Exports

var utils = module.exports = {};

/**
* Safe hasOwnProperty
*/

utils.object = {};

/**
* Safer helper for hasOwnProperty checks
*
* @param {Object} obj
* @param {String} prop
* @return {Boolean}
* @api public
*/

var hop = Object.prototype.hasOwnProperty;
utils.object.hasOwnProperty = function(obj, prop) {
  return hop.call(obj, prop);
};


/**
 * Escape Name
 *
 * Wraps a name in quotes to allow reserved
 * words as table or column names such as user.
 */

utils.escapeName = function escapeName(name, escapeCharacter) {
  var regex = new RegExp(escapeCharacter, 'g');
  var replacementString = '' + escapeCharacter + escapeCharacter;
  var replacementDot = '\.';
  return '' + escapeCharacter + name.replace(regex, replacementString).replace(/\./g, replacementDot) + escapeCharacter;
};

/**
 * Populate alias. Create the alias for an association
 *
 * @param {string} alias
 *
 * @returns {string}
 */

utils.populationAlias = function (alias) {
  return '__' + alias;
};

/**
 * Map Attributes
 *
 * Takes a js object and creates arrays used for parameterized
 * queries in postgres.
 */

utils.mapAttributes = function(data, options) {
  var keys = [],   // Column Names
      values = [], // Column Values
      params = [], // Param Index, ex: $1, $2
      i = 1;

  // Flag whether to use parameterized queries or not
  var parameterized = options && utils.object.hasOwnProperty(options, 'parameterized') ? options.parameterized : true;

  // Get the escape character
  var escapeCharacter = options && utils.object.hasOwnProperty(options, 'escapeCharacter') ? options.escapeCharacter : '"';

  // Determine if we should escape the inserted characters
  var escapeInserts = options && utils.object.hasOwnProperty(options, 'escapeInserts') ? options.escapeInserts : false;

  Object.keys(data).forEach(function(key) {
    var k = escapeInserts ? (options.escapeCharacter + key + options.escapeCharacter) : key;
    keys.push(k);

    var value = utils.prepareValue(data[key]);

    values.push(value);

    if(parameterized) {
      params.push('$' + i);
    }
    else {
      if(value === null || value === undefined) {
        params.push('null');
      }
      else {
        params.push(value);
      }
    }

    i++;
  });

  return({ keys: keys, values: values, params: params });
};

/**
 * Prepare values
 *
 * Transform a JS date to SQL date and functions
 * to strings.
 */

utils.prepareValue = function(value) {

  // Cast dates to SQL
  if (_.isDate(value)) {
    value = utils.toSqlDate(value);
  }

  // Cast functions to strings
  if (_.isFunction(value)) {
    value = value.toString();
  }

  // Store Arrays as strings
  if (Array.isArray(value)) {
    value = JSON.stringify(value);
  }

  // Store Buffers as hex strings (for BYTEA)
  if (Buffer.isBuffer(value)) {
    value = '\\x' + value.toString('hex');
  }

  return value;
};

/**
 * Escape Strings
 */

utils.escapeString = function(value) {
  if(!_.isString(value)) return value;

  value = value.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
    switch(s) {
      case "\0": return "\\0";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\b": return "\\b";
      case "\t": return "\\t";
      case "\x1a": return "\\Z";
      default: return "\\"+s;
    }
  });

  return value;
};

/**
 * JS Date to UTC Timestamp
 *
 * Dates should be stored in Postgres with UTC timestamps
 * and then converted to local time on the client.
 */

utils.toSqlDate = function(date) {
  return date.toUTCString();
};
