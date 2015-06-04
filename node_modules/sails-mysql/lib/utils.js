/**
 * Utility Functions
 */

// Dependencies
var mysql = require('mysql');
var _ = require('lodash');
var url = require('url');

// Module Exports

var utils = module.exports = {};

/**
 * Parse URL string from config
 *
 * Parse URL string into connection config parameters
 */

utils.parseUrl = function (config) {
  if(!_.isString(config.url)) return config;

  var obj = url.parse(config.url);

  config.host = obj.hostname || config.host;
  config.port = obj.port || config.port;

  if(_.isString(obj.path)) {
    config.database = obj.path.split("/")[1] || config.database;
  }

  if(_.isString(obj.auth)) {
    config.user = obj.auth.split(":")[0] || config.user;
    config.password = obj.auth.split(":")[1] || config.password;
  }
  return config;
};

/**
 * Prepare values
 *
 * Transform a JS date to SQL date and functions
 * to strings.
 */

utils.prepareValue = function(value) {

  if(_.isUndefined(value) || value === null) return value;

  // Cast functions to strings
  if (_.isFunction(value)) {
    value = value.toString();
  }

  // Store Arrays and Objects as strings
  if (Array.isArray(value) || value.constructor && value.constructor.name === 'Object') {
    try {
      value = JSON.stringify(value);
    } catch (e) {
      // just keep the value and let the db handle an error
      value = value;
    }
  }

  // Cast dates to SQL
  if (_.isDate(value)) {
    value = utils.toSqlDate(value);
  }

  return mysql.escape(value);
};

/**
 * Builds a Select statement determining if Aggeregate options are needed.
 */

utils.buildSelectStatement = function(criteria, table, schemaDefs) {

  var query = '';

  if(criteria.groupBy || criteria.sum || criteria.average || criteria.min || criteria.max) {
    query = 'SELECT ';

    // Append groupBy columns to select statement
    if(criteria.groupBy) {
      if(criteria.groupBy instanceof Array) {
        criteria.groupBy.forEach(function(opt){
          query += opt + ', ';
        });

      } else {
        query += criteria.groupBy + ', ';
      }
    }

    // Handle SUM
    if (criteria.sum) {
      if(criteria.sum instanceof Array) {
        criteria.sum.forEach(function(opt){
          query += 'SUM(' + opt + ') AS ' + opt + ', ';
        });

      } else {
        query += 'SUM(' + criteria.sum + ') AS ' + criteria.sum + ', ';
      }
    }

    // Handle AVG (casting to float to fix percision with trailing zeros)
    if (criteria.average) {
      if(criteria.average instanceof Array) {
        criteria.average.forEach(function(opt){
          query += 'AVG(' + opt + ') AS ' + opt + ', ';
        });

      } else {
        query += 'AVG(' + criteria.average + ') AS ' + criteria.average + ', ';
      }
    }

    // Handle MAX
    if (criteria.max) {
      if(criteria.max instanceof Array) {
        criteria.max.forEach(function(opt){
          query += 'MAX(' + opt + ') AS ' + opt + ', ';
        });

      } else {
        query += 'MAX(' + criteria.max + ') AS ' + criteria.max + ', ';
      }
    }

    // Handle MIN
    if (criteria.min) {
      if(criteria.min instanceof Array) {
        criteria.min.forEach(function(opt){
          query += 'MIN(' + opt + ') AS ' + opt + ', ';
        });

      } else {
        query += 'MIN(' + criteria.min + ') AS ' + criteria.min + ', ';
      }
    }

    // trim trailing comma
    query = query.slice(0, -2) + ' ';

    // Add FROM clause
    return query += 'FROM `' + table + '` ';
  }

  /**
   * If no aggregate options lets just build a normal query
   */


  // Add all keys to the select statement for this table
  query += 'SELECT ';

  var selectKeys = [],
      joinSelectKeys = [];

  if ( !schemaDefs[table] ) throw new Error('Schema definition missing for table: `'+table+'`');

  _( schemaDefs[table] ).forEach(function(schemaDef, key) {
    selectKeys.push({ table: table, key: key });
  });

  // Check for joins
  if(criteria.joins || criteria.join) {

    var joins = criteria.joins || criteria.join;

    joins.forEach(function(join) {
      if(!join.select) return;

      Object.keys(schemaDefs[join.child.toLowerCase()]).forEach(function(key) {
        var _join = _.cloneDeep(join);
        _join.key = key;
        joinSelectKeys.push(_join);
      });

      // Remove the foreign key for this join from the selectKeys array
      selectKeys = selectKeys.filter(function(select) {
        var keep = true;
        if(select.key === join.parentKey && join.removeParentKey) keep = false;
        return keep;
      });
    });
  }

  // Add all the columns to be selected that are not joins
  selectKeys.forEach(function(select) {
    query += '`' + select.table + '`.`' + select.key + '`, ';
  });

  // Add all the columns from the joined tables
  joinSelectKeys.forEach(function(select) {

    // Create an alias by prepending the child table with the alias of the join
    var alias = select.alias.toLowerCase() + '_' + select.child.toLowerCase();

    // If this is a belongs_to relationship, keep the foreign key name from the AS part
    // of the query. This will result in a selected column like: "user"."id" AS "user_id__id"
    if(select.model) {
      return query += mysql.escapeId(alias) + '.' + mysql.escapeId(select.key) + ' AS ' +
                      mysql.escapeId(select.parentKey + '__' + select.key) + ', ';
    }

    // If a junctionTable is used, the child value should be used in the AS part of the
    // select query.
    if(select.junctionTable) {
      return query += mysql.escapeId(alias) + '.' + mysql.escapeId(select.key) + ' AS ' +
                      mysql.escapeId(select.alias + '__' + select.key) + ', ';
    }

    // Else if a hasMany attribute is being selected, use the alias plus the child
    return query += mysql.escapeId(alias) + '.' + mysql.escapeId(select.key) + ' AS ' +
                    mysql.escapeId(select.alias + '__' + select.key) + ', ';
  });

  // Remove the last comma
  query = query.slice(0, -2) + ' FROM `' + table + '` ';

  return query;
};


/**
 * ignore
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


utils.toSqlDate = function toSqlDate(date) {

  date = date.getFullYear() + '-' +
    ('00' + (date.getMonth()+1)).slice(-2) + '-' +
    ('00' + date.getDate()).slice(-2) + ' ' +
    ('00' + date.getHours()).slice(-2) + ':' +
    ('00' + date.getMinutes()).slice(-2) + ':' +
    ('00' + date.getSeconds()).slice(-2);

  return date;
};
