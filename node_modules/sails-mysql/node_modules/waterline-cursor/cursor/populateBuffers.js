/**
 * Module Dependencies
 */

var _ = require('lodash');
var async = require('async');
var strategies = require('./strategies');

/**
 * Default populateBuffers implementation. Should be good to go on most noSql datastores.
 */

module.exports = function populateBuffers(options, cb) {

  var $find = options.$find;
  var $getPK = options.$getPK;
  var parentCollection = options.parentCollection;
  var buffers = options.buffers;
  var instructions = options.instructions;

  var parentRecords = [];
  var cachedChildren = {};

  async.auto({

    // Grab the parent records for the query
    processParent: function(next) {
      var parentCriteria = _.cloneDeep(options.instructions);
      delete parentCriteria.instructions;

      $find(parentCollection, parentCriteria, function(err, results) {
        if(err) return next(err);
        parentRecords = results;
        buffers.parents = parentRecords;
        next();
      });
    },


    // Build child buffers.
    // For each instruction, loop through the parent records and build up a
    // buffer for the record.
    buildChildBuffers: ['processParent', function(next, results) {
      async.each(_.keys(instructions.instructions), function(population, nextPop) {

        var populationObject = instructions.instructions[population];
        var popInstructions = populationObject.instructions;
        var pk = $getPK(popInstructions[0].parent);

        var alias = populationObject.strategy.strategy === 1 ? popInstructions[0].parentKey : popInstructions[0].alias;

        // Use eachSeries here to keep ordering
        async.eachSeries(parentRecords, function(parent, nextParent) {
          var buffer = {
            attrName: population,
            parentPK: parent[pk],
            pkAttr: pk,
            keyName: alias
          };

          var strategy = instructions.instructions[population].strategy.strategy;

          if(strategy === strategies.HAS_FK) {
            buffer.parentFK = parent[instructions.instructions[population].instructions[0].parentKey];
          }

          buffers.add(buffer);
          nextParent();
        }, nextPop);

      }, next);
    }],


    // Process the child results and attach to the buffers
    processChildren: ['buildChildBuffers', function(next, results) {

      // For each buffer build a query to populate it's children records.
      async.each(buffers.read(), function (buffer, next) {

        // Get the instruction set
        var instructionSet = instructions.instructions[buffer.attrName];

        // Cache the strategy
        var strategy = instructionSet.strategy.strategy;

        var childIdentity;

        // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
        // NOTE:
        // This step could be optimized by calculating the query function
        // ahead of time since we already know the association strategy it
        // will use before runtime.
        // •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

        // Special case for VIA_JUNCTOR:
        if (strategy === strategies.VIA_JUNCTOR) {

          var junctorIdentity = instructionSet.instructions[0].child;
          var junctorPK = $getPK(instructionSet.instructions[0].child);
          var junctorFKToParent = instructionSet.instructions[0].childKey;
          var junctorFKToChild = instructionSet.instructions[1] && instructionSet.instructions[1].parentKey;

          childIdentity = instructionSet.instructions[1].child;

          // NOTE:
          // (TODO: look at optimizing this later)
          // I think for this strategy we can always find all of the junctor
          // records relating to ANY of the parent records ahead of time, and
          // the `canCombineChildQueries` distinction is really just limited
          // to that third [set of] quer[ies/y].  For now, we just do a separate
          // query to the junctor for each parent record to keep things tight.
          var junctorCriteria = {where:{}};
          junctorCriteria.where[junctorFKToParent] = buffer.belongsToPKValue;

          $find(junctorIdentity, junctorCriteria, function _afterFetchingJunctorRecords(err, junctorRecordsForThisBuffer) {
            if (err) return next(err);

            // Build criteria to find matching child records which are also
            // related to ANY of the junctor records we just fetched.
            var bufferChildCriteria = _.cloneDeep(instructionSet.instructions[1].criteria);
            var whereObj = {};

            whereObj[instructionSet.instructions[1].childKey] = _.pluck(junctorRecordsForThisBuffer, junctorFKToChild);

            var childPK = $getPK(instructionSet.instructions[1].child);

            // Check if the given where contains the primary key. If so pull it out and check that the
            // value exists in the junctoRecords for this buffer. If so set the array to only contain
            // that value.
            if(bufferChildCriteria.where.hasOwnProperty(childPK)) {
              var pkFilter = _.cloneDeep(bufferChildCriteria.where[childPK]);
              delete bufferChildCriteria.where[childPK];

              if(!Array.isArray(pkFilter)) {
                pkFilter = [pkFilter];
              }

              whereObj[instructionSet.instructions[1].childKey] = _.intersection(whereObj[instructionSet.instructions[1].childKey], pkFilter);
            }

            bufferChildCriteria.where = _.assign(whereObj, bufferChildCriteria.where);

            // Now find related child records
            $find(childIdentity, bufferChildCriteria, function _afterFetchingRelatedChildRecords(err, childRecordsForThisBuffer) {
              if (err) return next(err);

              buffer.records = childRecordsForThisBuffer;
              return next();
            });
          });

        }

        // General case for the other strategies:
        else {

          childIdentity = instructionSet.instructions[0].child;
          var criteriaToPopulateBuffer = _.cloneDeep(instructionSet.instructions[0].criteria || {});
          var whereObj = {};

          switch (strategy) {
            case strategies.HAS_FK:
              whereObj[instructionSet.instructions[0].childKey] = buffer.belongsToFKValue;
              criteriaToPopulateBuffer.where = _.assign(whereObj, criteriaToPopulateBuffer.where);
              break;
            case strategies.VIA_FK:
              whereObj[instructionSet.instructions[0].childKey] = buffer.belongsToPKValue;
              criteriaToPopulateBuffer.where = _.assign(whereObj, criteriaToPopulateBuffer.where);
              break;
          }

          $find(childIdentity, criteriaToPopulateBuffer, function _afterFetchingBufferRecords(err, childRecordsForThisBuffer) {
            if(err) return next(err);
            buffer.records = childRecordsForThisBuffer;
            return next();
          });
        }

      }, next);
    }]

  }, cb);

};
