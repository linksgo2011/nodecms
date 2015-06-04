/*---------------------------------------------------------------
  :: sails-mysql
  -> adapter
---------------------------------------------------------------*/

// Dependencies
var async = require('async');
var _ = require('lodash');
var util = require('util');
var mysql = require('mysql');

var Errors = require('waterline-errors').adapter;
var Sequel = require('waterline-sequel');
var Cursor = require('waterline-cursor');

var utils = require('./utils');
var _teardownConnection = require('./connections/teardown');
var _spawnConnection = require('./connections/spawn');
var _registerConnection = require('./connections/register');

var sql = require('./sql.js');

var hop = utils.object.hasOwnProperty;

var STRINGFILE = {
  noCallbackError: 'An error occurred in the MySQL adapter, but no callback was specified to the spawnConnection function to handle it.'
};

// Hack for development - in future versions, allow
// string queries to be elegantly displayed (see wl2
// or tweet @mikermcneil for status of this feature or
// to help out)
var LOG_QUERIES = process.env.LOG_QUERIES === 'true';

module.exports = (function() {

  // Keep track of all the connections
  var connections = {};

  var sqlOptions = {
    parameterized: false,
    caseSensitive: false,
    escapeCharacter: '`',
    casting: false,
    canReturnValues: false,
    escapeInserts: true
  };

  var adapter = {

    //
    // TODO: make the exported thing an EventEmitter for when there's no callback.
    //
    emit: function (evName, data) {

      // temporary hack- should only be used for cases that would crash anyways
      // (see todo above- we still shouldn't throw, emit instead, hence this stub)
      if (evName === 'error') { throw data; }
    },

    // Which type of primary key is used by default
    pkFormat: 'integer',

    // Whether this adapter is syncable (yes)
    syncable: true,

    defaults: {
      pool: true,
      connectionLimit: 5,
      waitForConnections: true
    },

    escape: function(val) {
      return mysql.escape(val);
    },

    escapeId: function(name) {
      return mysql.escapeId(name);
    },


    registerConnection: _registerConnection.configure(connections),
    teardown: _teardownConnection.configure(connections),


    // Direct access to query
    query: function(connectionName, collectionName, query, data, cb, connection) {

      if (_.isFunction(data)) {
        cb = data;
        data = null;
      }

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __QUERY__, cb);
      } else {
        __QUERY__(connection, cb);
      }

      function __QUERY__(connection, cb) {

        // Run query
        if (data) connection.query(query, data, cb);
        else connection.query(query, cb);

      }
    },


    // Fetch the schema for a collection
    // (contains attributes and autoIncrement value)
    describe: function(connectionName, collectionName, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __DESCRIBE__, cb);
      } else {
        __DESCRIBE__(connection, cb);
      }

      function __DESCRIBE__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        if (!collection) {
          return cb(util.format('Unknown collection `%s` in connection `%s`', collectionName, connectionName));
        }
        var tableName = mysql.escapeId(collectionName);

        var query = 'DESCRIBE ' + tableName;
        var pkQuery = 'SHOW INDEX FROM ' + tableName;

        // Run query
        if (LOG_QUERIES) {
          console.log('\nExecuting MySQL query: ',query);
          console.log('and: ',pkQuery);
        }
        connection.query(query, function __DESCRIBE__(err, schema) {
          if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
              return cb();
            } else return cb(err);
          }

          connection.query(pkQuery, function(err, pkResult) {
            if(err) return cb(err);

            // Loop through Schema and attach extra attributes
            schema.forEach(function(attr) {

              // Set Primary Key Attribute
              if(attr.Key === 'PRI') {
                attr.primaryKey = true;

                // If also an integer set auto increment attribute
                if(attr.Type === 'int(11)') {
                  attr.autoIncrement = true;
                }
              }

              // Set Unique Attribute
              if(attr.Key === 'UNI') {
                attr.unique = true;
              }
            });

            // Loop Through Indexes and Add Properties
            pkResult.forEach(function(result) {
              schema.forEach(function(attr) {
                if(attr.Field !== result.Column_name) return;
                attr.indexed = true;
              });
            });

            // Convert mysql format to standard javascript object
            var normalizedSchema = sql.normalizeSchema(schema);

            // Set Internal Schema Mapping
            collection.schema = normalizedSchema;

            // TODO: check that what was returned actually matches the cache
            cb(null, normalizedSchema);
          });

        });
      }
    },

    // Create a new collection
    define: function(connectionName, collectionName, definition, cb, connection) {
      var self = this;

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __DEFINE__, cb);
      } else {
        __DEFINE__(connection, cb);
      }

      function __DEFINE__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        if (!collection) {
          return cb(util.format('Unknown collection `%s` in connection `%s`', collectionName, connectionName));
        }
        var tableName = mysql.escapeId(collectionName);

        // Iterate through each attribute, building a query string
        var schema = sql.schema(tableName, definition);

        // Build query
        var query = 'CREATE TABLE ' + tableName + ' (' + schema + ')';

        if(connectionObject.config.charset) {
          query += ' DEFAULT CHARSET ' + connectionObject.config.charset;
        }

        if(connectionObject.config.collation) {
          if(!connectionObject.config.charset) query += ' DEFAULT ';
          query += ' COLLATE ' + connectionObject.config.collation;
        }


        // Run query
        if (LOG_QUERIES) {
          console.log('\nExecuting MySQL query: ',query);
        }
        connection.query(query, function __DEFINE__(err, result) {
          if (err) return cb(err);

          //
          // TODO:
          // Determine if this can safely be changed to the `adapter` closure var
          // (i.e. this is the last remaining usage of the "this" context in the MySQLAdapter)
          //

          self.describe(connectionName, collectionName, function(err) {
            cb(err, result);
          });
        });

      }
    },

    // Drop an existing collection
    drop: function(connectionName, collectionName, relations, cb, connection) {

      if(typeof relations === 'function') {
        cb = relations;
        relations = [];
      }

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __DROP__, cb);
      } else {
        __DROP__(connection, cb);
      }

      function __DROP__(connection, cb) {

        var connectionObject = connections[connectionName];


        // Drop any relations
        function dropTable(item, next) {

          var collection = connectionObject.collections[item];
          var tableName = mysql.escapeId(collectionName);

          // Build query
          var query = 'DROP TABLE ' + tableName;

          if (LOG_QUERIES) {
            console.log('\nExecuting MySQL query: ',query);
          }

          // Run query
          connection.query(query, function __DROP__(err, result) {
            if (err) {
              if (err.code !== 'ER_BAD_TABLE_ERROR' && err.code !== 'ER_NO_SUCH_TABLE') return next(err);
              result = null;
            }

            next(null, result);
          });
        }

        async.eachSeries(relations, dropTable, function(err) {
          if(err) return cb(err);
          dropTable(collectionName, cb);
        });

      }
    },

    //
    addAttribute: function (connectionName, collectionName, attrName, attrDef, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __ADD_ATTRIBUTE__, cb);
      } else {
        __ADD_ATTRIBUTE__(connection, cb);
      }

      function __ADD_ATTRIBUTE__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        var tableName = collectionName;

        var query = sql.addColumn(tableName, attrName, attrDef);

        // Run query
        if (LOG_QUERIES) {
          console.log('\nExecuting MySQL query: ',query);
        }

        // Run query
        connection.query(query, function(err, result) {
          if (err) return cb(err);

          // TODO: marshal response to waterline interface
          cb(err);
        });

      }
    },

    //
    removeAttribute: function (connectionName, collectionName, attrName, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __REMOVE_ATTRIBUTE__, cb);
      } else {
        __REMOVE_ATTRIBUTE__(connection, cb);
      }

      function __REMOVE_ATTRIBUTE__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        var tableName = collectionName;

        var query = sql.removeColumn(tableName, attrName);

        if (LOG_QUERIES) {
          console.log('\nExecuting MySQL query: ',query);
        }

        // Run query
        connection.query(query, function(err, result) {
          if (err) return cb(err);

          // TODO: marshal response to waterline interface
          cb(err);
        });

      }
    },

    // No custom alter necessary-- alter can be performed by using the other methods (addAttribute, removeAttribute)
    // you probably want to use the default in waterline core since this can get complex
    // (that is unless you want some enhanced functionality-- then please be my guest!)

    // Create one or more new models in the collection
    create: function(connectionName, collectionName, data, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __CREATE__, cb);
      } else {
        __CREATE__(connection, cb);
      }

      function __CREATE__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        var tableName = collectionName;

        var _insertData = _.cloneDeep(data);

        // Prepare values
        Object.keys(data).forEach(function(value) {
          data[value] = utils.prepareValue(data[value]);
        });

        var schema = connectionObject.schema;
        var _query;

        var sequel = new Sequel(schema, sqlOptions);

        // Build a query for the specific query strategy
        try {
          _query = sequel.create(collectionName, data);
        } catch(e) {
          return cb(e);
        }

        // Run query
        connection.query(_query.query, function(err, result) {
          if (err) return cb( handleQueryError(err) );

          // Build model to return
          var autoInc = null;

          Object.keys(collection.definition).forEach(function(key) {
            if(!collection.definition[key].hasOwnProperty('autoIncrement')) return;
            autoInc = key;
          });

          var autoIncData = {};

          if (autoInc) {
            autoIncData[autoInc] = result.insertId;
          }

          var values = _.extend({}, _insertData, autoIncData);
          cb(err, values);
        });
      }
    },

    // Override of createEach to share a single connection
    // instead of using a separate connection for each request
    createEach: function (connectionName, collectionName, valuesList, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __CREATE_EACH__, cb);
      } else {
        __CREATE_EACH__(connection, cb);
      }


      function __CREATE_EACH__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        var tableName = collectionName;

        var records = [];

        async.eachSeries(valuesList, function (data, cb) {

          // Prepare values
          Object.keys(data).forEach(function(value) {
            data[value] = utils.prepareValue(data[value]);
          });

          var schema = connectionObject.schema;
          var _query;

          var sequel = new Sequel(schema, sqlOptions);

          // Build a query for the specific query strategy
          try {
            _query = sequel.create(collectionName, data);
          } catch(e) {
            return cb(e);
          }

          // Run query
          connection.query(_query.query, function(err, results) {
            if (err) return cb( handleQueryError(err) );
            records.push(results.insertId);
            cb();
          });
        }, function(err) {
          if(err) return cb(err);

          var pk = 'id';

          Object.keys(collection.definition).forEach(function(key) {
            if(!collection.definition[key].hasOwnProperty('primaryKey')) return;
            pk = key;
          });

          // If there are no records (`!records.length`)
          // then skip the query altogether- we don't need to look anything up
          if (!records.length){
            return cb(null, []);
          }

          // Build a Query to get newly inserted records
          var query = 'SELECT * FROM ' + mysql.escapeId(tableName) + ' WHERE ' + mysql.escapeId(pk) + ' IN (' + records + ');';

          // Run Query returing results
          if (LOG_QUERIES) {
            console.log('\ncreateEach() :: Executing MySQL query: ',query);
          }
          connection.query(query, function(err, results) {
            if(err) return cb(err);
            cb(null, results);
          });
        });

      }
    },

    /**
     * [join description]
     * @param  {[type]} conn     [description]
     * @param  {[type]} coll     [description]
     * @param  {[type]} criteria [description]
     * @param  {[type]} cb      [description]
     * @return {[type]}          [description]
     */
    join: function (connectionName, collectionName, options, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __JOIN__, cb);
      } else {
        __JOIN__(connection, cb);
      }

      function __JOIN__(client, done) {

        // Populate associated records for each parent result
        // (or do them all at once as an optimization, if possible)
        Cursor({

          instructions: options,
          nativeJoins: true,

          /**
           * Find some records directly (using only this adapter)
           * from the specified collection.
           *
           * @param  {String}   collectionIdentity
           * @param  {Object}   criteria
           * @param  {Function} _cb
           */
          $find: function (collectionName, criteria, _cb) {
            return adapter.find(connectionName, collectionName, criteria, _cb, client);
          },

          /**
           * Look up the name of the primary key field
           * for the collection with the specified identity.
           *
           * @param  {String}   collectionIdentity
           * @return {String}
           */
          $getPK: function (collectionName) {
            if (!collectionName) return;
            return _getPK(connectionName, collectionName);
          },

          /**
           * Given a strategy type, build up and execute a SQL query for it.
           *
           * @param {}
           */

          $populateBuffers: function populateBuffers(options, next) {

            var buffers = options.buffers;
            var instructions = options.instructions;

            // Grab the collection by looking into the connection
            var connectionObject = connections[connectionName];
            var collection = connectionObject.collections[collectionName];

            var parentRecords = [];
            var cachedChildren = {};

            // Grab Connection Schema
            var schema = {};

            Object.keys(connectionObject.collections).forEach(function(coll) {
              schema[coll] = connectionObject.collections[coll].schema;
            });

            // Build Query
            var _schema = connectionObject.schema;

            var sequel = new Sequel(_schema, sqlOptions);
            var _query;

            // Build a query for the specific query strategy
            try {
              _query = sequel.find(collectionName, instructions);
            } catch(e) {
              return next(e);
            }

            async.auto({

              processParent: function(next) {
                client.query(_query.query[0], function __FIND__(err, result) {
                  if(err) return next(err);

                  parentRecords = result;

                  var splitChildren = function(parent, next) {
                    var cache = {};

                    _.keys(parent).forEach(function(key) {

                      // Check if we can split this on our special alias identifier '___' and if
                      // so put the result in the cache
                      var split = key.split('___');
                      if(split.length < 2) return;

                      if(!hop(cache, split[0])) cache[split[0]] = {};
                      cache[split[0]][split[1]] = parent[key];
                      delete parent[key];
                    });

                    // Combine the local cache into the cachedChildren
                    if(_.keys(cache).length > 0) {
                      _.keys(cache).forEach(function(pop) {
                        if(!hop(cachedChildren, pop)) cachedChildren[pop] = [];
                        cachedChildren[pop] = cachedChildren[pop].concat(cache[pop]);
                      });
                    }

                    next();
                  };


                  // Pull out any aliased child records that have come from a hasFK association
                  async.eachSeries(parentRecords, splitChildren, function(err) {
                    if(err) return next(err);
                    buffers.parents = parentRecords;
                    next();
                  });
                });
              },

              // Build child buffers.
              // For each instruction, loop through the parent records and build up a
              // buffer for the record.
              buildChildBuffers: ['processParent', function(next, results) {
                async.each(_.keys(instructions.instructions), function(population, nextPop) {

                  var populationObject = instructions.instructions[population];
                  var popInstructions = populationObject.instructions;
                  var pk = _getPK(connectionName, popInstructions[0].parent);

                  var alias = populationObject.strategy.strategy === 1 ? popInstructions[0].parentKey : popInstructions[0].alias;

                  // Use eachSeries here to keep ordering
                  async.eachSeries(parentRecords, function(parent, nextParent) {
                    var buffer = {
                      attrName: population,
                      parentPK: parent[pk],
                      pkAttr: pk,
                      keyName: alias
                    };

                    var records = [];

                    // Check for any cached parent records
                    if(hop(cachedChildren, alias)) {
                      cachedChildren[alias].forEach(function(cachedChild) {
                        var childVal = popInstructions[0].childKey;
                        var parentVal = popInstructions[0].parentKey;

                        if(cachedChild[childVal] !== parent[parentVal]) {
                          return;
                        }

                        // If null value for the parentVal, ignore it
                        if(parent[parentVal] === null) return;

                        records.push(cachedChild);
                      });
                    }

                    if(records.length > 0) {
                      buffer.records = records;
                    }

                    buffers.add(buffer);
                    nextParent();
                  }, nextPop);
                }, next);
              }],


              processChildren: ['buildChildBuffers', function(next, results) {

                // Remove the parent query
                _query.query.shift();

                async.each(_query.query, function(q, next) {

                  var qs = '';
                  var pk;

                  if(!Array.isArray(q.instructions)) {
                    pk = _getPK(connectionName, q.instructions.parent);
                  }
                  else if(q.instructions.length > 1) {
                    pk = _getPK(connectionName, q.instructions[0].parent);
                  }

                  parentRecords.forEach(function(parent) {
                    if(_.isNumber(parent[pk])) {
                      qs += q.qs.replace('^?^', parent[pk]) + ' UNION ';
                    } else {
                      qs += q.qs.replace('^?^', '"' + parent[pk] + '"') + ' UNION ';
                    }
                  });

                  // Remove the last UNION
                  qs = qs.slice(0, -7);

                  // Add a final sort to the Union clause for integration
                  if(parentRecords.length > 1) {
                    var addedOrder = false;

                    function addSort(sortKey, sorts) {
                        if (!sortKey.match(/^[0-9,a-z,A-Z$_]+$/)) {
                          return;
                        }
                        if (!addedOrder) {
                          addedOrder = true;
                          qs += ' ORDER BY ';
                        }

                        var direction = sorts[sortKey] === 1 ? 'ASC' : 'DESC';
                        qs += sortKey + ' ' + direction;
                    }

                    if(!Array.isArray(q.instructions)) {
                      _.keys(q.instructions.criteria.sort).forEach(function(sortKey) {
                        addSort(sortKey, q.instructions.criteria.sort);
                      });
                    }
                    else if(q.instructions.length === 2) {
                      _.keys(q.instructions[1].criteria.sort).forEach(function(sortKey) {
                        addSort(sortKey, q.instructions[1].criteria.sort);
                      });
                    }
                  }

                  client.query(qs, function __FIND__(err, result) {
                    if(err) return next(err);

                    var groupedRecords = {};

                    result.forEach(function(row) {

                      if(!Array.isArray(q.instructions)) {
                        if(!hop(groupedRecords, row[q.instructions.childKey])) {
                          groupedRecords[row[q.instructions.childKey]] = [];
                        }

                        groupedRecords[row[q.instructions.childKey]].push(row);
                      }
                      else {

                        // Grab the special "foreign key" we attach and make sure to remove it
                        var fk = '___' + q.instructions[0].childKey;

                        if(!hop(groupedRecords, row[fk])) {
                          groupedRecords[row[fk]] = [];
                        }

                        var data = _.cloneDeep(row);
                        delete data[fk];
                        groupedRecords[row[fk]].push(data);
                      }
                    });

                    buffers.store.forEach(function(buffer) {
                      if(buffer.attrName !== q.attrName) return;
                      var records = groupedRecords[buffer.belongsToPKValue];
                      if(!records) return;
                      if(!buffer.records) buffer.records = [];
                      buffer.records = buffer.records.concat(records);
                    });

                    next();
                  });
                }, function(err) {
                  next();
                });

              }]

            },
            function(err) {
              if(err) return next(err);
              next();
            });

          }

        }, done);
      }
    },


    // Find one or more models from the collection
    // using where, limit, skip, and order
    // In where: handle `or`, `and`, and `like` queries
    find: function(connectionName, collectionName, options, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __FIND__, cb);
      } else {
        __FIND__(connection, cb);
      }

      function __FIND__(connection, cb) {

        // Check if this is an aggregate query and that there is something to return
        if(options.groupBy || options.sum || options.average || options.min || options.max) {
          if(!options.sum && !options.average && !options.min && !options.max) {
            return cb(Errors.InvalidGroupBy);
          }
        }

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];

        // Build find query
        var schema = connectionObject.schema;
        var _query;

        var sequel = new Sequel(schema, sqlOptions);

        // Build a query for the specific query strategy
        try {
          _query = sequel.find(collectionName, options);
        } catch(e) {
          return cb(e);
        }

        // Run query
        if (LOG_QUERIES) {
          console.log('\nExecuting MySQL query: ',_query);
        }

        connection.query(_query.query[0], function(err, result) {
          if(err) return cb(err);
          cb(null, result);
        });

      }
    },

    // Count one model from the collection
    // using where, limit, skip, and order
    // In where: handle `or`, `and`, and `like` queries
    count: function(connectionName, collectionName, options, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __COUNT__, cb);
      } else {
        __COUNT__(connection, cb);
      }

      function __COUNT__(connection, cb) {

        // Check if this is an aggregate query and that there is something to return
        if(options.groupBy || options.sum || options.average || options.min || options.max) {
          if(!options.sum && !options.average && !options.min && !options.max) {
            return cb(Errors.InvalidGroupBy);
          }
        }

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        var tableName = collectionName;

        // Build a copy of the schema to send w/ the query
        var localSchema = _.reduce(connectionObject.collections, function (localSchema, collection, cid) {
          localSchema[cid] = collection.schema;
          return localSchema;
        }, {});

        // Build find query
        var query = sql.countQuery(tableName, options, localSchema);

        // Run query
        connection.query(query, function(err, result) {
          if(err) return cb(err);
          // Return the count from the simplified query
          cb(null, result[0].count);
        });
      }
    },

    // Stream one or more models from the collection
    // using where, limit, skip, and order
    // In where: handle `or`, `and`, and `like` queries
    stream: function(connectionName, collectionName, options, stream, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __STREAM__);
      } else {
        __STREAM__(connection);
      }

      function __STREAM__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        var tableName = collectionName;

        // Build find query
        var query = sql.selectQuery(tableName, options);

        // Run query
        var dbStream = connection.query(query);

        // Handle error, an 'end' event will be emitted after this as well
        dbStream.on('error', function(err) {
          stream.end(err); // End stream
          cb(err); // Close connection
        });

        // the field packets for the rows to follow
        dbStream.on('fields', function(fields) {});

        // Pausing the connnection is useful if your processing involves I/O
        dbStream.on('result', function(row) {
          connection.pause();
          stream.write(row, function() {
            connection.resume();
          });
        });

        // all rows have been received
        dbStream.on('end', function() {
          stream.end(); // End stream
          cb(); // Close connection
        });
      }
    },

    // Update one or more models in the collection
    update: function(connectionName, collectionName, options, values, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __UPDATE__, cb);
      } else {
        __UPDATE__(connection, cb);
      }

      function __UPDATE__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];

        // Build find query
        var schema = connectionObject.schema;
        var _query;

        var sequel = new Sequel(schema, sqlOptions);

        // Build a query for the specific query strategy
        try {
          _query = sequel.find(collectionName, _.cloneDeep(options));
        } catch(e) {
          return cb(e);
        }

        connection.query(_query.query[0], function(err, results) {
          if(err) return cb(err);

          var ids = [];

          var pk = 'id';
          Object.keys(collection.definition).forEach(function(key) {
            if(!collection.definition[key].hasOwnProperty('primaryKey')) return;
            pk = key;
          });

          // update statement will affect 0 rows
          if (results.length === 0) {
            return cb(null, []);
          }

          results.forEach(function(result) {
            ids.push(result[pk]);
          });

          // Prepare values
          Object.keys(values).forEach(function(value) {
            values[value] = utils.prepareValue(values[value]);
          });

          // Build query
          try {
            _query = sequel.update(collectionName, options, values);
          } catch(e) {
            return cb(e);
          }

          // Run query
          connection.query(_query.query, function(err, result) {
            if (err) return cb( handleQueryError(err) );

            var criteria;
            if(ids.length === 1) {
              criteria = { where: {}, limit: 1 };
              criteria.where[pk] = ids[0];
            } else {
              criteria = { where: {} };
              criteria.where[pk] = ids;
            }

            // Build a query for the specific query strategy
            try {
              _query = sequel.find(collectionName, criteria);
            } catch(e) {
              return cb(e);
            }

            // Run query
            connection.query(_query.query[0], function(err, result) {
              if(err) return cb(err);
              cb(null, result);
            });
          });

        });
      }
    },

    // Delete one or more models from the collection
    destroy: function(connectionName, collectionName, options, cb, connection) {

      if(_.isUndefined(connection)) {
        return spawnConnection(connectionName, __DESTROY__, cb);
      } else {
        __DESTROY__(connection, cb);
      }

      function __DESTROY__(connection, cb) {

        var connectionObject = connections[connectionName];
        var collection = connectionObject.collections[collectionName];
        var tableName = collectionName;

        // Build query
        var schema = connectionObject.schema;

        var _query;

        var sequel = new Sequel(schema, sqlOptions);

        // Build a query for the specific query strategy
        try {
          _query = sequel.destroy(collectionName, options);
        } catch(e) {
          return cb(e);
        }

        async.auto({

          findRecords: function(next) {
            adapter.find(connectionName, collectionName, options, next, connection);
          },

          destroyRecords: ['findRecords', function(next) {
            connection.query(_query.query, next);
          }]
        },
        function(err, results) {
          if(err) return cb(err);
          cb(null, results.findRecords);
        });

      }
    },


    // Identity is here to facilitate unit testing
    // (this is optional and normally automatically populated based on filename)
    identity: 'sails-mysql'
  };



  return adapter;



  /**
   * Wrap a function in the logic necessary to provision a connection.
   * (either grab a free connection from the pool or create a new one)
   *
   * cb is optional (you might be streaming), but... come to think of it...
   * TODO:
   * if streaming, pass in the stream instead of the callback--
   * then any relevant `error` events can be emitted on the stream.
   *
   * @param  {[type]}   connectionName
   * @param  {Function} fn
   * @param  {[type]}   cb
   */
  function spawnConnection(connectionName, fn, cb) {
    _spawnConnection(
      getConnectionObject(connectionName),
      fn,
      wrapCallback(cb)
    );
  }




  ////// NOTE /////////////////////////////////////////////////////////////
  //
  // both of these things should be done in WL core, imo:
  //
  // i.e.
  // getConnectionObject(connectionName)
  // wrapCallback(cb)
  //
  /////////////////////////////////////////////////////////////////////////



  /**
   * wrapCallback
   *
   * cb is optional (you might be streaming), but... come to think of it...
   * TODO:
   * if streaming, pass in the stream instead of the callback--
   * then any relevant `error` events can be emitted on the stream.
   *
   * @param  {Function} cb [description]
   * @return {[type]}      [description]
   */
  function wrapCallback (cb) {

    // Handle missing callback:
    if (!cb) {
      // Emit errors on adapter itself when no callback is present.
      cb = function (err) {
        try {
          adapter.emit(STRINGFILE.noCallbackError+'\n'+err.toString());
        }
        catch (e) { adapter.emit(err); }
      };
    }
    return cb;
  }


  /**
   * Lookup the primary key for the given collection
   * @param  {[type]} collectionIdentity [description]
   * @return {[type]}                    [description]
   * @api private
   */
  function _getPK (connectionIdentity, collectionIdentity) {

    var collectionDefinition;
    try {
      collectionDefinition = connections[connectionIdentity].collections[collectionIdentity].definition;

      return _.find(Object.keys(collectionDefinition), function _findPK (key) {
        var attrDef = collectionDefinition[key];
        if( attrDef && attrDef.primaryKey ) return key;
        else return false;
      }) || 'id';
    }
    catch (e) {
      throw new Error('Unable to determine primary key for collection `'+collectionIdentity+'` because '+
        'an error was encountered acquiring the collection definition:\n'+ require('util').inspect(e,false,null));
    }
  }


  /**
   *
   * @param  {String} connectionName
   * @return {Object} connectionObject
   */
  function getConnectionObject ( connectionName ) {

    var connectionObject = connections[connectionName];
    if(!connectionObject) {

      // this should never happen unless the adapter is being called directly
      // (i.e. outside of a CONNection OR a COLLection.)
      adapter.emit('error', Errors.InvalidConnection);
    }
    return connectionObject;
  }

  /**
   *
   * @param  {[type]} err [description]
   * @return {[type]}     [description]
   * @api private
   */
  function handleQueryError (err) {

    var formattedErr;

    // Check for uniqueness constraint violations:
    if (err.code === 'ER_DUP_ENTRY') {

      // Manually parse the MySQL error response and extract the relevant bits,
      // then build the formatted properties that will be passed directly to
      // WLValidationError in Waterline core.
      var matches = err.message.match(/Duplicate entry '(.*)' for key '(.*?)'$/);
      if (matches && matches.length) {
        formattedErr = {};
        formattedErr.code = 'E_UNIQUE';
        formattedErr.invalidAttributes = {};
        formattedErr.invalidAttributes[matches[2]] = [{
          value: matches[1],
          rule: 'unique'
        }];
      }
    }

    return formattedErr || err;
  }

})();

