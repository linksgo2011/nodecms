/**
 * Module dependencies
 */

var _ = require('lodash');

var SelectBuilder = require('./select');
var WhereBuilder = require('./where');
var utils = require('./lib/utils');


/**
 * Sequel generator
 *
 * Given a Waterline Query Object build a SQL query.
 */

var Sequel = module.exports = function(schema, options) {

  // Store the schema values for the database structure
  this.schema = schema || {};

  // To solve a query, multiple query strings may be needed.
  this.queries = [];

  // Flag whether queries should be built using parameterized queries or not.
  // Default is true.
  this.parameterized = options && utils.object.hasOwnProperty(options, 'parameterized') ? options.parameterized : true;

  // Flag if things should be cast, useful for averages
  this.cast = options && utils.object.hasOwnProperty(options, 'casting') ? options.casting : false;

  // Flag whether the database is case-sensitive or not.
  // Default is true.
  // NOTE: This does not mean that your queries will be case sensitive. It just flags if the queries
  // should use lower or regex logic for querying.
  this.caseSensitive = options && utils.object.hasOwnProperty(options, 'caseSensitive') ? options.caseSensitive : true;

  // Set the escape character, default is "
  this.escapeCharacter = options && utils.object.hasOwnProperty(options, 'escapeCharacter') ? options.escapeCharacter : '"';

  // Set if the database can return values from things such as an insert
  this.canReturnValues = options && utils.object.hasOwnProperty(options, 'canReturnValues') ? options.canReturnValues : false;

  // Determine if insert values should be escaped or not
  this.escapeInserts = options && utils.object.hasOwnProperty(options, 'escapeInserts') ? options.escapeInserts : false;

  // Determine if aliased tablenames in DELETE queries need to be referenced before the FROM, e.g.
  // DELETE `tableName` FROM `tableName` as `otherTableName` WHERE `otherTableName`.`foo` = "bar"
  // MySQL and Oracle require this, but it doesn't work in Postgresql.
  this.declareDeleteAlias = options && utils.object.hasOwnProperty(options, 'declareDeleteAlias') ? options.declareDeleteAlias : true;

  // Waterline NEXT
  // These are flags that can be toggled today and expose future features. If any of the following are turned
  // on the adapter tests will probably not pass. If you toggle these know what you are getting into.
  var wlNext = options && utils.object.hasOwnProperty(options, 'wlNext') ? options.wlNext : {};
  this.wlNext = {

    // Case sensitive - false
    // In the next version of WL queries will be case sensitive by default.
    // Set this to true to experiement with that feature today.
    caseSensitive: utils.object.hasOwnProperty(wlNext, 'caseSensitive') ? wlNext.caseSensitive : false

  };


  this.values = [];

  return this;
};

/**
 * Build a SQL Find Query using the defined schema.
 */

Sequel.prototype.find = function find(currentTable, queryObject) {

  // Step 1:
  // Build out the Select statements
  var selectObject = this.select(currentTable, queryObject);
  this.queries = selectObject.select;

  var whereObject;
  var childQueries;
  var query;
  var values;

  /**
   * Step 2 - Build out the parent query.
   */

  whereObject = this.simpleWhere(currentTable, queryObject);

  this.queries[0] += ' ' + whereObject.query;
  this.values[0] = whereObject.values;

  /**
   * Step 3 - Build out the child query templates.
   */

  childQueries = this.complexWhere(currentTable, queryObject);
  this.queries = this.queries.concat(childQueries);

  return {
    query: this.queries,
    values: this.values
  };

};

/**
 * Build a SQL Count Query using the defined schema.
 */

Sequel.prototype.count = function count(currentTable, queryObject) {

  // Step 1:
  // Build out the Count statements
  // TO-DO: limit this to a certain column, e.g. id, for performance gains
  this.queries = ['SELECT COUNT(*) FROM ' + currentTable];

  var whereObject;
  var childQueries;
  var query;
  var values;

  /**
   * Step 2 - Build out the parent query.
   */

  whereObject = this.simpleWhere(currentTable, queryObject);

  this.queries[0] += ' ' + whereObject.query;
  this.values[0] = whereObject.values;

  /**
   * Step 3 - Build out the child query templates.
   */

  childQueries = this.complexWhere(currentTable, queryObject);
  this.queries = this.queries.concat(childQueries);

  return {
    query: this.queries,
    values: this.values
  };

};


/**
 * Build a SQL Create Query.
 */

Sequel.prototype.create = function create(currentTable, data) {

  var options = {
    parameterized: this.parameterized,
    escapeCharacter: this.escapeCharacter,
    escapeInserts: this.escapeInserts
  };

  // Transform the Data object into arrays used in a parameterized query
  var attributes = utils.mapAttributes(data, options);
  var columnNames = attributes.keys.join(', ');
  var paramValues = attributes.params.join(', ');

  // Build Query
  var query = 'INSERT INTO ' + utils.escapeName(currentTable, this.escapeCharacter) + ' (' + columnNames + ') values (' + paramValues + ')';

  if(this.canReturnValues) {
    query += ' RETURNING *';
  }

  return { query: query, values: attributes.values };
};

/**
 * Build a SQL Update Query.
 */

Sequel.prototype.update = function update(currentTable, queryObject, data) {

  var options = {
    parameterized: this.parameterized,
    escapeCharacter: this.escapeCharacter,
    escapeInserts: this.escapeInserts
  };

  // Get the attribute identity (as opposed to the table name)
  var identity = currentTable;
  // Create the query with the tablename aliased as the identity (in case they are different)
  var query = 'UPDATE ' + utils.escapeName(currentTable, this.escapeCharacter) + ' AS ' + utils.escapeName(identity, this.escapeCharacter) + ' ';

  // Transform the Data object into arrays used in a parameterized query
  var attributes = utils.mapAttributes(data, options);

  // Update the paramCount
  var paramCount = attributes.params.length + 1;

  // Build SET string
  var str = '';
  for(var i=0; i < attributes.keys.length; i++) {
    str += attributes.keys[i] + ' = ' + attributes.params[i] + ', ';
  }

  // Remove trailing comma
  str = str.slice(0, -2);

  query += 'SET ' + str + ' ';

  // Add data values to this._values
  var values = attributes.values;

  // Build Criteria clause
  var whereObject = this.simpleWhere(currentTable, queryObject, { paramCount: paramCount });

  query += ' ' + whereObject.query;
  values = values.concat(whereObject.values);

  if(this.canReturnValues) {
    query += ' RETURNING *';
  }

  return {
    query: query,
    values: values
  };
};


/**
 * Build Delete SQL query.
 */

Sequel.prototype.destroy = function destroy(currentTable, queryObject) {

  // Get the attribute identity (as opposed to the table name)
  var identity = currentTable;

  var query = 'DELETE ' + (this.declareDeleteAlias ? utils.escapeName(identity, this.escapeCharacter) : '') + ' FROM ' + utils.escapeName(currentTable, this.escapeCharacter) + ' AS ' + utils.escapeName(identity, this.escapeCharacter) + ' ';

  // Build Criteria clause
  var whereObject = this.simpleWhere(currentTable, queryObject);

  query += ' ' + whereObject.query;
  var values = whereObject.values;

  if(this.canReturnValues) {
    query += ' RETURNING *';
  }

  return {
    query: query,
    values: values
  };
};


/**
 * Build the select statements for a query.
 */

Sequel.prototype.select = function select(currentTable, queryObject) {
  var options = {
    escapeCharacter: this.escapeCharacter,
    caseSensitive: this.caseSensitive,
    cast: this.cast,
    wlNext: this.wlNext
  };

  return new SelectBuilder(this.schema, currentTable, queryObject, options);
};

/**
 * Build the where statements for a query.
 */

Sequel.prototype.simpleWhere = function simpleWhere(currentTable, queryObject, options) {
  var _options = {
    parameterized: this.parameterized,
    caseSensitive: this.caseSensitive,
    escapeCharacter: this.escapeCharacter,
    wlNext: this.wlNext
  };

  var where = new WhereBuilder(this.schema, currentTable, _options);
  return where.single(queryObject, options);
};

Sequel.prototype.complexWhere = function complexWhere(currentTable, queryObject, options) {
  var _options = {
    parameterized: this.parameterized,
    caseSensitive: this.caseSensitive,
    escapeCharacter: this.escapeCharacter
  };

  var where = new WhereBuilder(this.schema, currentTable, _options);
  return where.complex(queryObject, options);
};
