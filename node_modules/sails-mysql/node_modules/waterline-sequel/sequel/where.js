/**
 * Module dependecies
 */

var _ = require('lodash');
var CriteriaParser = require('./lib/criteriaProcessor');
var utils = require('./lib/utils');
var hop = utils.object.hasOwnProperty;

/**
 * Build WHERE query clause
 *
 * `Where` conditions may use key/value model attributes for simple query
 * look ups as well as more complex conditions.
 *
 * The following conditions are supported along with simple criteria:
 *
 *   Conditions:
 *     [And, Or, Like, Not]
 *
 *   Criteria Operators:
 *     [<, <=, >, >=, !]
 *
 *   Criteria Helpers:
 *     [lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual, not, like, contains, startsWith, endsWith]
 *
 * ####Example
 *
 *   where: {
 *     name: 'foo',
 *     age: {
 *       '>': 25
 *     },
 *     like: {
 *       name: '%foo%'
 *     },
 *     or: [
 *       { like: { foo: '%foo%' } },
 *       { like: { bar: '%bar%' } }
 *     ],
 *     name: [ 'foo', 'bar;, 'baz' ],
 *     age: {
 *       not: 40
 *     }
 *   }
 */

var WhereBuilder = module.exports = function WhereBuilder(schema, currentTable, options) {

  this.schema = schema;
  this.currentTable = currentTable;

  this.wlNext = {};

  if(options && hop(options, 'parameterized')) {
    this.parameterized = options.parameterized;
  }

  if(options && hop(options, 'caseSensitive')) {
    this.caseSensitive = options.caseSensitive;
  }

  if(options && hop(options, 'escapeCharacter')) {
    this.escapeCharacter = options.escapeCharacter;
  }

  // Add support for WL Next features
  if(options && hop(options, 'wlNext')) {
    this.wlNext = options.wlNext;
  }

  return this;
};


/**
 * Build a Simple Where clause
 */

WhereBuilder.prototype.single = function single(queryObject, options) {

  if(!queryObject) return {
	query: '',
	values: []
  };

  var self = this;
  var queryString = '';
  var addSpace = false;

  // Add any hasFK strategy joins to the main query
  _.keys(queryObject.instructions).forEach(function(attr) {

    var strategy = queryObject.instructions[attr].strategy.strategy;
    var population = queryObject.instructions[attr].instructions[0];
    var alias = utils.escapeName(utils.populationAlias(population.alias), self.escapeCharacter);

    var parentAlias = _.find(_.values(self.schema), {tableName: population.parent}).tableName;
    // Handle hasFK
    if(strategy === 1) {

      // Set outer join logic
      queryString += 'LEFT OUTER JOIN ' + utils.escapeName(population.child, self.escapeCharacter) + ' AS ' + alias + ' ON ';
      queryString += utils.escapeName(parentAlias, self.escapeCharacter) + '.' + utils.escapeName(population.parentKey, self.escapeCharacter);
      queryString += ' = ' + alias + '.' + utils.escapeName(population.childKey, self.escapeCharacter);

      addSpace = true;
    }
  });

  if(addSpace) {
    queryString += ' ';
  }

  var tmpCriteria = _.cloneDeep(queryObject);
  delete tmpCriteria.instructions;

  // Ensure a sort is always set so that we get back consistent results
  if(!hop(queryObject, 'sort')) {
    var childPK;

    _.keys(this.schema[this.currentTable].attributes).forEach(function(attr) {
      var expandedAttr = self.schema[self.currentTable].attributes[attr];
      if(!hop(expandedAttr, 'primaryKey')) return;
      childPK = expandedAttr.columnName || attr;
    });

    queryObject.sort = {};
    queryObject.sort[childPK] = -1;
  }

  // Read the queryObject and get back a query string and params
  // Use the tmpCriteria here because all the joins have been removed
  var parsedCriteria = {};

  // Build up a WHERE queryString
  if(tmpCriteria.where) {
    queryString += 'WHERE ';
  }

  // Mixin the parameterized flag into options
  var _options = _.assign({
    parameterized: this.parameterized,
    caseSensitive: this.caseSensitive,
    escapeCharacter: this.escapeCharacter,
    wlNext: this.wlNext
  }, options);

  this.criteriaParser = new CriteriaParser(this.currentTable, this.schema, _options);
  parsedCriteria = this.criteriaParser.read(tmpCriteria);
  queryString += parsedCriteria.query;

  // Remove trailing AND if it exists
  if(queryString.slice(-4) === 'AND ') {
    queryString = queryString.slice(0, -5);
  }

  // Remove trailing OR if it exists
  if(queryString.slice(-3) === 'OR ') {
    queryString = queryString.slice(0, -4);
  }

  var values;
  if(parsedCriteria && _.isArray(parsedCriteria.values)) {
    values = parsedCriteria.values;
  }
  else {
    values = [];
  }

  return {
    query: queryString,
    values: values
  };
};

/**
 * Build a template for a complex UNION query. This is needed when populating using
 * SKIP, SORT and LIMIT.
 */

WhereBuilder.prototype.complex = function complex(queryObject, options) {

  var self = this;
  var queries = [];

  // Look up the child instructions and build out a template for each based on the type of join.
  if(!queryObject) return '';

  _.keys(queryObject.instructions).forEach(function(attr) {

    var queryString = '';
    var criteriaParser;
    var parsedCriteria;
    var childPK;
    var _options;

    var strategy = queryObject.instructions[attr].strategy.strategy;

    // Handle viaFK
    if(strategy === 2) {

      var population = queryObject.instructions[attr].instructions[0];
      var populationAlias = _.find(_.values(self.schema), {tableName: population.child}).tableName;

      // Mixin the parameterized flag into options
      _options = _.assign({
        parameterized: self.parameterized,
        caseSensitive: self.caseSensitive,
        escapeCharacter: self.escapeCharacter,
        wlNext: self.wlNext
      }, options);

      // Build the WHERE part of the query string
      criteriaParser = new CriteriaParser(populationAlias, self.schema, _options);

      // Ensure a sort is always set so that we get back consistent results
      if(!hop(population.criteria, 'sort')) {

        _.keys(self.schema[populationAlias].attributes).forEach(function(attr) {
          var expandedAttr = self.schema[populationAlias].attributes[attr];
          if(!hop(expandedAttr, 'primaryKey')) return;
          childPK = expandedAttr.columnName || attr;
        });

        population.criteria.sort = {};
        population.criteria.sort[childPK] = 1;
      }

      // Read the queryObject and get back a query string and params
      parsedCriteria = criteriaParser.read(population.criteria);

      queryString = '(SELECT * FROM ' + utils.escapeName(population.child, self.escapeCharacter) + ' AS ' + utils.escapeName(populationAlias, self.escapeCharacter) + ' WHERE ' + utils.escapeName(population.childKey, self.escapeCharacter) + ' = ^?^ ';
      if(parsedCriteria) {

        // If where criteria was used append an AND clause
        if(population.criteria.where && _.keys(population.criteria.where).length > 0) {
          queryString += 'AND ';
        }

        queryString += parsedCriteria.query;
      }

      queryString += ')';

      // Add to the query list
      queries.push({
        qs: queryString,
        instructions: population,
        attrName: attr,
        values: parsedCriteria.values
      });
    }

    // Handle viaJunctor
    else if(strategy === 3) {

      var stage1 = queryObject.instructions[attr].instructions[0];
      var stage2 = queryObject.instructions[attr].instructions[1];
      stage1ChildAlias = _.find(_.values(self.schema), {tableName: stage1.child}).tableName;
      stage2ChildAlias = _.find(_.values(self.schema), {tableName: stage2.child}).tableName;

      // Mixin the parameterized flag into options
      _options = _.assign({
        parameterized: self.parameterized,
        caseSensitive: self.caseSensitive,
        escapeCharacter: self.escapeCharacter,
        wlNext: self.wlNext
      }, options);

      // Build the WHERE part of the query string
      criteriaParser = new CriteriaParser(stage2ChildAlias, self.schema, _options);

      // Ensure a sort is always set so that we get back consistent results
      if(!hop(stage2.criteria, 'sort')) {

        _.keys(self.schema[stage2ChildAlias].attributes).forEach(function(attr) {
          var expandedAttr = self.schema[stage2ChildAlias].attributes[attr];
          if(!hop(expandedAttr, 'primaryKey')) return;
          childPK = expandedAttr.columnName || attr;
        });

        stage2.criteria.sort = {};
        stage2.criteria.sort[childPK] = 1;
      }

      // Read the queryObject and get back a query string and params
      parsedCriteria = criteriaParser.read(stage2.criteria);

      // Look into the schema and build up attributes to select
      var selectKeys = [];

      _.keys(self.schema[stage2ChildAlias].attributes).forEach(function(key) {
        var schema = self.schema[stage2ChildAlias].attributes[key];
        if(hop(schema, 'collection')) return;
        selectKeys.push({ table: stage2.child, key: schema.columnName || key });
      });

      queryString += '(SELECT ';
      selectKeys.forEach(function(projection) {
        var projectionAlias = _.find(_.values(self.schema), {tableName: projection.table}).tableName;
        queryString += utils.escapeName(projectionAlias, self.escapeCharacter) + '.' + utils.escapeName(projection.key, self.escapeCharacter) + ',';
      });

      // Add an inner join to give us a key to select from
      queryString += utils.escapeName(stage1.child, self.escapeCharacter) + '.' + utils.escapeName(stage1.childKey, self.escapeCharacter) + ' AS "___' + stage1.childKey + '"';

      queryString += ' FROM ' + utils.escapeName(stage2.child, self.escapeCharacter) + ' AS ' + utils.escapeName(stage2ChildAlias, self.escapeCharacter) + ' ';
      queryString += ' INNER JOIN ' + utils.escapeName(stage1.child, self.escapeCharacter) + ' ON ' + utils.escapeName(stage2.parent, self.escapeCharacter);
      queryString += '.' + utils.escapeName(stage2.parentKey, self.escapeCharacter) + ' = ' + utils.escapeName(stage2ChildAlias, self.escapeCharacter) + '.' + utils.escapeName(stage2.childKey, self.escapeCharacter);
      queryString += ' WHERE ' + utils.escapeName(stage2ChildAlias, self.escapeCharacter) + '.' + utils.escapeName(stage2.childKey, self.escapeCharacter) + ' IN ';
      queryString += '(SELECT ' + utils.escapeName(stage1.child, self.escapeCharacter) + '.' + utils.escapeName(stage2.parentKey, self.escapeCharacter) + ' FROM ';
      queryString += utils.escapeName(stage1.child, self.escapeCharacter) + ' WHERE ' + utils.escapeName(stage1.child, self.escapeCharacter) + '.' + utils.escapeName(stage1.childKey, self.escapeCharacter);
      queryString +=  ' = ^?^ ) ';

      if(parsedCriteria) {

        // If where criteria was used append an AND clause
        if(stage2.criteria.where && _.keys(stage2.criteria.where).length > 0) {
          queryString += 'AND ';
        }

        queryString += parsedCriteria.query;
      }

      queryString += ')';

      // Add to the query list
      queries.push({
        qs: queryString,
        instructions: queryObject.instructions[attr].instructions,
        attrName: attr,
        values: parsedCriteria.values
      });
    }
  });

  return queries;
};
