/**
 * Module dependencies
 */

var _ = require('lodash');
var async = require('async');
var strategies = require('./strategies');

/**
 * Expand a set of join instructions into a stategy based instruction set.
 *
 */

var StrategyPlanner = module.exports = function StrategyPlanner(options) {
  this.$getPK = options.$getPK;
  return this;
};


/**
 * Given a set of associations, attach meta data to each one with the strategy type.
 *
 */

StrategyPlanner.prototype.plan = function plan(criteria) {

  var self = this;
  var groupedAssociations = this.groupAssociations(criteria);

  _.keys(groupedAssociations).forEach(function(key) {

    var instructions = _.cloneDeep(groupedAssociations[key]);
    var strategy = self.determineStrategy(groupedAssociations[key]);

    // Overwrite the grouped associations and insert the strategy and original instructions
    groupedAssociations[key] = {
      strategy: strategy,
      instructions: instructions
    };

  });

  // Replace joins with the newly created instructions
  criteria.instructions = groupedAssociations;
  delete criteria.joins;

  return criteria;
};


/**
 * Given a criteria object, group the joins by alias.
 *
 */

StrategyPlanner.prototype.groupAssociations = function groupAssociations(criteria) {
  return _.groupBy(criteria.joins, 'alias');
};


/**
 * Figure out a strategy for a specific set of options.
 *
 *
 */

StrategyPlanner.prototype.determineStrategy = function determineStrategy(instructions) {

  var self = this;

  if(!instructions) {
    throw new Error('Missing options when planning the query');
  }

  // Lookup relevant collection identities and primary keys
  var parentIdentity = _.first(instructions).parent;
  var childIdentity = _.last(instructions).child;

  // Ensure we found parent and child identities
  if(!parentIdentity) {
    throw new Error('Unable to find a parentIdentity in ', instructions);
  }

  if(!childIdentity) {
    throw new Error('Unable to find a childIdentity in ', instructions);
  }

  // Calculate the parent and child primary keys
  var parentPK = this.$getPK(parentIdentity);
  var childPK = this.$getPK(childIdentity);

  // Lookup the base child criteria
  // (populate..where, populate..limit, etc.)
  //
  // Note that default limit, etc. should not be applied here
  // since they are taken care of in Waterline core.
  var childCriteria = _.last(instructions).criteria || {};

  // Determine the type of association rule (i.e. "strategy") we'll be using.
  //
  // Note that in future versions of waterline, this logic
  // will be internalized to simplify adapter implementation.
  var strategy = (
    // If there are more than one join instructions, there must be an
    // intermediate (junctor) collection involved
    instructions.length === 2 ? strategies.VIA_JUNCTOR :
    // If the parent's PK IS the foreign key (i.e. parentKey) specified
    // in the join instructions, we know to use the `viaFK` AR (i.e. belongsToMany)
    instructions[0].parentKey === parentPK ? strategies.VIA_FK :
    // Otherwise this is a basic foreign key component relationship
    strategies.HAS_FK
  );

  if (!strategy) {
    throw new Error('Could not derive association strategy in adapter');
  }

  // Build an object to hold any meta-data for the strategy
  var meta = {};

  // Now lookup strategy-specific association metadata.

  // `parentFK` will only be meaningful if this is the `HAS_FK` strategy.
  if(strategy === strategies.HAS_FK) {
    meta.parentFK = instructions[0].parentKey;
  }

  // `childFK` will only be meaningful if this is the `VIA_FK` strategy.
  if(strategy === strategies.VIA_FK) {
    meta.childFK = instructions[0].childKey;
  }

  // `junctorIdentity`, `junctorFKToParent`, `junctorFKToChild`, and `junctorPK`
  // will only be meaningful if this is the `VIA_JUNCTOR` strategy.
  if(strategy === strategies.VIA_JUNCTOR) {
    meta.junctorIdentity = instructions[0].child;
    meta.junctorPK = self.$getPK(instructions[0].child);
    meta.junctorFKToParent = instructions[0].childKey;
    meta.junctorFKToChild = instructions[1] && instructions[1].parentKey;
  }

  return {
    strategy: strategy,
    meta: meta
  };
};
