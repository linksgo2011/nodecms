/**
 * Module Dependencies
 */

var _ = require('lodash');
var QueryPlanner = require('./planner');

/**
 * Process the query when native joins are supported.
 *
 */

var Cursor = module.exports = function Cursor(options) {

  this.$find = options.$find;
  this.$getPK = options.$getPK;
  this.$populateBuffers = options.$populateBuffers;
  this.buffers = options.buffers;
  this.parentCollection = options.parentCollection;

  return this;
};


/**
 * Run the native join logic described in the populateBuffers command.
 *
 */

Cursor.prototype.run = function run(criteria, cb) {

  var self = this;

  // Plan out the strategies for each join in the criteria
  var planner = new QueryPlanner({ $getPK: this.$getPK });
  var mappedCriteria;

  try {
    mappedCriteria = planner.plan(criteria);
  } catch(err) {
    return cb(err);
  }

  // Given the mappedCriteria, send it populateBuffers
  this.$populateBuffers({
    $find: self.$find,
    $getPK: self.$getPK,
    instructions: mappedCriteria,
    buffers: self.buffers,
    parentCollection: this.parentCollection
  },

  function afterPopulateBuffers(err) {
    if(err) return cb(err);
    self.attachRecords(cb);
  });
};


/**
 * Attach buffered records.
 *
 */

Cursor.prototype.attachRecords = function attachRecords(cb) {

  // Now we need to pluck out the parent results from the buffers
  var parentRecords = this.buffers.getParents();

  if(!parentRecords) {
    return cb(new Error('No records were flagged as the top level records in the query.'));
  }

  // Read all the records from the buffers
  var bufferedRecords = this.buffers.read();
  // If no buffers are used, we are done
  if(bufferedRecords.length === 0) {
    return cb(null, parentRecords);
  }

  _.each(bufferedRecords, function (buffer) {

    var matchingParentRecord = _.find(parentRecords, function (parentRecord) {
      return parentRecord[buffer.parentPkAttr] === buffer.belongsToPKValue;
    });

    // This should always be true, but checking just in case.
    if (_.isObject(matchingParentRecord)) {

      // If the value in `attrName` for this record is not an array,
      // it is probably a foreign key value.  Fortunately, at this point
      // we can go ahead and replace it safely since any logic relying on it
      // is complete (i.e. although we may still have other queries finishing
      // up for other association attributes, we're done populating THIS one, see?)
      //
      // In fact, and for the same reason, we can safely override the value of
      // `buffer.attrName` for the parent record at this point, no matter what!
      // This is nice, because `buffer.records` is already sorted, limited, and
      // skipped, so we don't have to mess with that.
      //
      if (buffer.records && buffer.records.length) {
        matchingParentRecord[buffer.keyName] = buffer.records;
      } else {
        matchingParentRecord[buffer.keyName] = null;
      }
    }

    // Note that we do ensure that an empty array gets sent back for each parent
    // record (since unnecessary buffers and their `buffer.records` remain undefined
    // until set to save RAM) This is important for compatibility with WL1 core
    _.each(parentRecords, function (parentRecord) {
      parentRecord[buffer.keyName] = parentRecord[buffer.keyName] || [];
    });

  });

  return cb(null, parentRecords);
};
