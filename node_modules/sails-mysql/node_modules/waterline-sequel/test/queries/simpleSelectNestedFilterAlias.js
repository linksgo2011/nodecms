/**
 * This works because waterline-sequel resolves the used alias back to the original key as used in the schema.
 * That way, the query stays the same, but you have the freedom to use aliases.
 */
module.exports = {

  // A description. This is used for display in the test output.
  description: 'Should construct a nested filter select query using aliased property (using the alias).',

  // The name of the table this query should be ran against.
  table      : 'oddity',

  // The query object used to build this query.
  query      : {
    where: {
      stubborn : {
        meta : 'foo'
      }
    }
  },

  // Expected results per query method.
  expected   : {

    // Sequel.select()
    select: {

      // The queryString we expect to be rendered after calling `Sequel.select()`
      queryString    : 'SELECT `oddity`.`meta`, `oddity`.`id`, `oddity`.`createdAt`, `oddity`.`updatedAt`, `oddity`.`stubborn`, `oddity`.`bat` FROM `oddity` AS `oddity` ',

      // The number of queries that will be returned after calling Sequel.select()
      queriesReturned: 1,
    },

    // Sequel.find()
    find  : {

      // The queryString we expect to be rendered after calling `Sequel.select()`
      queryString    : 'SELECT `oddity`.`meta`, `oddity`.`id`, `oddity`.`createdAt`, `oddity`.`updatedAt`, `oddity`.`stubborn`, `oddity`.`bat` FROM `oddity` AS `oddity`  WHERE `__bar`.`meta` = "foo"  ',

      // The number of queries that will be returned after calling Sequel.select()
      queriesReturned: 1
    }
  }
};
