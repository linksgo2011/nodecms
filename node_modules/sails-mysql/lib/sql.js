/**
 * Module Dependencies
 */

var mysql = require('mysql');
var _ = require('lodash');
var utils = require('./utils');
var hop = utils.object.hasOwnProperty;

var sql = module.exports = {

  // Convert mysql format to standard javascript object
  normalizeSchema: function (schema) {
    return _.reduce(schema, function(memo, field) {

      // Marshal mysql DESCRIBE to waterline collection semantics
      var attrName = field.Field;
      var type = field.Type;

      // Remove (n) column-size indicators
      type = type.replace(/\([0-9]+\)$/,'');

      memo[attrName] = {
        type: type,
        defaultsTo: field.Default,
        autoIncrement: field.Extra === 'auto_increment'
      };

      if(field.primaryKey) {
        memo[attrName].primaryKey = field.primaryKey;
      }

      if(field.unique) {
        memo[attrName].unique = field.unique;
      }

      if(field.indexed) {
        memo[attrName].indexed = field.indexed;
      }

      return memo;
    }, {});
  },

  // @returns ALTER query for adding a column
  addColumn: function (collectionName, attrName, attrDef) {
    // Escape table name and attribute name
    var tableName = mysql.escapeId(collectionName);

    // sails.log.verbose("ADDING ",attrName, "with",attrDef);

    // Build column definition
    var columnDefinition = sql._schema(collectionName, attrDef, attrName);

    return 'ALTER TABLE ' + tableName + ' ADD ' + columnDefinition;
  },

  // @returns ALTER query for dropping a column
  removeColumn: function (collectionName, attrName) {
    // Escape table name and attribute name
    var tableName = mysql.escapeId(collectionName);
    attrName = mysql.escapeId(attrName);

    return 'ALTER TABLE ' + tableName + ' DROP COLUMN ' + attrName;
  },

  countQuery: function(collectionName, options, tableDefs){
    var query = 'SELECT count(*) as count from `' + collectionName + '`';
    return query += sql.serializeOptions(collectionName, options, tableDefs);
  },

  // Create a schema csv for a DDL query
  schema: function(collectionName, attributes) {
    return sql.build(collectionName, attributes, sql._schema);
  },

  _schema: function(collectionName, attribute, attrName) {
    attrName = mysql.escapeId(attrName);
    var type = sqlTypeCast(attribute);

    // Process PK field
    if(attribute.primaryKey) {

      // If type is an integer, set auto increment
      if(type === 'INT') {
        return attrName + ' INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY';
      }

      // Just set NOT NULL on other types
      return attrName + ' VARCHAR(255) NOT NULL PRIMARY KEY';
    }

    // Process NOT NULL field.
    // if notNull is true, set NOT NULL constraint
    var nullPart = '';
    if (attribute.notNull) {
      nullPart = ' NOT NULL ';
    }

    // Process UNIQUE field
    if(attribute.unique) {
      return attrName + ' ' + type + nullPart + ' UNIQUE KEY';
    }

    // Process INDEX field (NON-UNIQUE KEY)
    if(attribute.index) {
      return attrName + ' ' + type + nullPart + ', INDEX(' + attrName + ')';
    }

    return attrName + ' ' + type + ' ' + nullPart;
  },

  // Create an attribute csv for a DQL query
  attributes: function(collectionName, attributes) {
    return sql.build(collectionName, attributes, sql.prepareAttribute);
  },

  // Create a value csv for a DQL query
  // key => optional, overrides the keys in the dictionary
  values: function(collectionName, values, key) {
    return sql.build(collectionName, values, sql.prepareValue, ', ', key);
  },

  prepareCriterion: function(collectionName, value, key, parentKey) {
    // Special sub-attr case
    if (validSubAttrCriteria(value)) {
      return sql.where(collectionName, value, null, key);

    }

    // Build escaped attr and value strings using either the key,
    // or if one exists, the parent key
    var attrStr, valueStr;


    // Special comparator case
    if (parentKey) {

      attrStr = sql.prepareAttribute(collectionName, value, parentKey);
      valueStr = sql.prepareValue(collectionName, value, parentKey);

      // Why don't we strip you out of those bothersome apostrophes?
      var nakedButClean = String(valueStr).replace(new RegExp('^\'+|\'+$', 'g'), '');

      if (key === '<' || key === 'lessThan') return attrStr + '<' + valueStr;
      else if (key === '<=' || key === 'lessThanOrEqual') return attrStr + '<=' + valueStr;
      else if (key === '>' || key === 'greaterThan') return attrStr + '>' + valueStr;
      else if (key === '>=' || key === 'greaterThanOrEqual') return attrStr + '>=' + valueStr;
      else if (key === '!' || key === 'not') {
        if (value === null) return attrStr + ' IS NOT NULL';
        else if (_.isArray(value)) return attrStr + ' NOT IN(' + valueStr + ')';
        else return attrStr + '<>' + valueStr;
      }
      else if (key === 'like') return attrStr + ' LIKE \'' + nakedButClean + '\'';
      else if (key === 'contains') return attrStr + ' LIKE \'%' + nakedButClean + '%\'';
      else if (key === 'startsWith') return attrStr + ' LIKE \'' + nakedButClean + '%\'';
      else if (key === 'endsWith') return attrStr + ' LIKE \'%' + nakedButClean + '\'';
      else throw new Error('Unknown comparator: ' + key);
    } else {
      attrStr = sql.prepareAttribute(collectionName, value, key);
      valueStr = sql.prepareValue(collectionName, value, key);

      // Special IS NULL case
      if (_.isNull(value)) {
        return attrStr + " IS NULL";
      } else return attrStr + "=" + valueStr;
    }
  },

  prepareValue: function(collectionName, value, attrName) {

    // Cast dates to SQL
    if (_.isDate(value)) {
      value = toSqlDate(value);
    }

    // Cast functions to strings
    if (_.isFunction(value)) {
      value = value.toString();
    }

    // Escape (also wraps in quotes)
    return mysql.escape(value);
  },

  prepareAttribute: function(collectionName, value, attrName) {
    return mysql.escapeId(collectionName) + '.' + mysql.escapeId(attrName);
  },

  // // Starting point for predicate evaluation
  // // parentKey => if set, look for comparators and apply them to the parent key
  where: function(collectionName, where, key, parentKey) {
    return sql.build(collectionName, where, sql.predicate, ' AND ', undefined, parentKey);
  },

  // Recursively parse a predicate calculus and build a SQL query
  predicate: function(collectionName, criterion, key, parentKey) {
    var queryPart = '';


    if (parentKey) {
      return sql.prepareCriterion(collectionName, criterion, key, parentKey);
    }

    // OR
    if (key.toLowerCase() === 'or') {
      queryPart = sql.build(collectionName, criterion, sql.where, ' OR ');
      return ' ( ' + queryPart + ' ) ';
    }

    // AND
    else if (key.toLowerCase() === 'and') {
      queryPart = sql.build(collectionName, criterion, sql.where, ' AND ');
      return ' ( ' + queryPart + ' ) ';
    }

    // IN
    else if (_.isArray(criterion)) {
      queryPart = sql.prepareAttribute(collectionName, null, key) + " IN (" + sql.values(collectionName, criterion, key) + ")";
      return queryPart;
    }

    // LIKE
    else if (key.toLowerCase() === 'like') {
      return sql.build(collectionName, criterion, function(collectionName, value, attrName) {
        var attrStr = sql.prepareAttribute(collectionName, value, attrName);


        // TODO: Handle regexp criterias
        if (_.isRegExp(value)) {
          throw new Error('RegExp LIKE criterias not supported by the MySQLAdapter yet.  Please contribute @ http://github.com/balderdashy/sails-mysql');
        }

        var valueStr = sql.prepareValue(collectionName, value, attrName);

        // Handle escaped percent (%) signs [encoded as %%%]
        valueStr = valueStr.replace(/%%%/g, '\\%');

        return attrStr + " LIKE " + valueStr;
      }, ' AND ');
    }

    // NOT
    else if (key.toLowerCase() === 'not') {
      throw new Error('NOT not supported yet!');
    }

    // Basic criteria item
    else {
      return sql.prepareCriterion(collectionName, criterion, key);
    }

  },

  serializeOptions: function(collectionName, options, tableDefs) {

    // Join clause
    // allow the key to be named with join or joins
    var joins = options.join || options.joins || [];

    if (joins.length > 0) {
      return this.buildJoinQuery(collectionName, joins, options, tableDefs);
    }

    return this.buildSingleQuery(collectionName, options, tableDefs);
  },

  /**
   * Build Up a Select Statement Without Joins
   */

  buildSingleQuery: function(collectionName, options, tableDefs) {
    var queryPart = '';

    if(options.where) {
      queryPart += 'WHERE ' + sql.where(collectionName, options.where) + ' ';
    }

    if (options.groupBy) {
      queryPart += 'GROUP BY ';

      // Normalize to array
      if(!Array.isArray(options.groupBy)) options.groupBy = [options.groupBy];

      options.groupBy.forEach(function(key) {
        queryPart += key + ', ';
      });

      // Remove trailing comma
      queryPart = queryPart.slice(0, -2) + ' ';
    }

    if (options.sort) {
      queryPart += 'ORDER BY ';

      // Sort through each sort attribute criteria
      _.each(options.sort, function(direction, attrName) {

        queryPart += sql.prepareAttribute(collectionName, null, attrName) + ' ';

        // Basic MongoDB-style numeric sort direction
        if (direction === 1) {
          queryPart += 'ASC, ';
        } else {
          queryPart += 'DESC, ';
        }
      });

      // Remove trailing comma
      if(queryPart.slice(-2) === ', ') {
        queryPart = queryPart.slice(0, -2) + ' ';
      }
    }

    if (hop(options, 'limit') && (options.limit !== null && options.limit !== undefined)) {
      queryPart += 'LIMIT ' + options.limit + ' ';
    }

    if (hop(options, 'skip') && (options.skip !== null && options.skip !== undefined)) {
      // Some MySQL hackery here.  For details, see:
      // http://stackoverflow.com/questions/255517/mysql-offset-infinite-rows
      if (!options.limit) {
          queryPart += 'LIMIT 18446744073709551610 ';
      }
      queryPart += 'OFFSET ' + options.skip + ' ';
    }

    return queryPart;
  },

  // Put together the CSV aggregation
  // separator => optional, defaults to ', '
  // keyOverride => optional, overrides the keys in the dictionary
  //          (used for generating value lists in IN queries)
  // parentKey => key of the parent to this object
  build: function(collectionName, collection, fn, separator, keyOverride, parentKey) {
    separator = separator || ', ';
    var $sql = '';
    _.each(collection, function(value, key) {
      $sql += fn(collectionName, value, keyOverride || key, parentKey);

      // (always append separator)
      $sql += separator;
    });

    // (then remove final one)
    return String($sql).replace(new RegExp(separator + '+$'), '');
  }
};

// Cast waterline types into SQL data types
function sqlTypeCast(attr) {
  var type = attr.type;
  type = type && type.toLowerCase();

  switch (type) {
    case 'string': {
      var size = 255; // By default.

      // If attr.size is positive integer, use it as size of varchar.
      if(!isNaN(attr.size) && (parseInt(attr.size) == parseFloat(attr.size)) && (parseInt(attr.size) > 0))
        size = attr.size;

      return 'VARCHAR(' + size + ')';
    }

    case 'text':
    case 'array':
    case 'json':
      return 'LONGTEXT';

    case 'mediumtext':
      return 'mediumtext';

    case 'longtext':
      return 'longtext';

    case 'boolean':
      return 'BOOL';

    case 'int':
    case 'integer':
      return 'INT';

    case 'float':
    case 'double':
      return 'FLOAT';

    case 'date':
      return 'DATE';

    case 'datetime':
      return 'DATETIME';

    case 'time':
      return 'TIME';

    case 'binary':
      return 'BLOB';

    default:
      console.error('Unregistered type given: ' + type);
      return 'LONGTEXT';
  }
}

function wrapInQuotes(val) {
  return '"' + val + '"';
}

function toSqlDate(date) {

  date = date.getFullYear() + '-' +
    ('00' + (date.getMonth()+1)).slice(-2) + '-' +
    ('00' + date.getDate()).slice(-2) + ' ' +
    ('00' + date.getHours()).slice(-2) + ':' +
    ('00' + date.getMinutes()).slice(-2) + ':' +
    ('00' + date.getSeconds()).slice(-2);

  return date;
}

// Return whether this criteria is valid as an object inside of an attribute
function validSubAttrCriteria(c) {
  return _.isObject(c) && (
  !_.isUndefined(c.not) || !_.isUndefined(c.greaterThan) || !_.isUndefined(c.lessThan) ||
  !_.isUndefined(c.greaterThanOrEqual) || !_.isUndefined(c.lessThanOrEqual) || !_.isUndefined(c['<']) ||
  !_.isUndefined(c['<=']) || !_.isUndefined(c['!']) || !_.isUndefined(c['>']) || !_.isUndefined(c['>=']) ||
  !_.isUndefined(c.startsWith) || !_.isUndefined(c.endsWith) || !_.isUndefined(c.contains) || !_.isUndefined(c.like));
}
