/**
 * Module dependencies
 */

var _ = require('lodash');
var async = require('async');

// var QueryPlanner = require('./cursor/planner');
var Cursor = require('./cursor/cursor');
var Buffer = require('./cursor/buffer');
var populateBuffers = require('./cursor/populateBuffers');

/**
 * Run joins (adapter-agnostic)
 *
 * @param  {Object}   options
 *                      .parentResults
 *                      .instructions
 *                      .$find()  {Function}
 *                      .$getPK() {Function}
 *
 * @param  {Function} cb
 */

module.exports = function runJoins(options, cb) {

  var criteria = options.instructions;
  var parentCollection = options.parentCollection;

  // var supportsNative = options.nativeJoins || false;
  var $find = options.$find;
  var $getPK = options.$getPK;
  var $populateBuffers = options.$populateBuffers || populateBuffers;

  // Create a new buffer
  var buffers = new Buffer();

  // Normalize joins key name
  if(criteria.join) {
    criteria.joins = criteria.join;
  }

  var cursor = new Cursor({
    $getPK: $getPK,
    $find: $find,
    $populateBuffers: $populateBuffers,
    buffers: buffers,
    parentCollection: parentCollection
  });

  cursor.run(criteria, cb);

};
