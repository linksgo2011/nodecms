module.exports = {

  // A description. This is used for display in the test output.
  description: 'Should construct a simple select query with a populate',

  // The name of the table this query should be ran against.
  table      : 'foo',

  // The query object used to build this query.
  query      : {
    where       : null,
    instructions: {
      bat: {
        strategy    : {
          strategy: 1,
          meta    : {
            parentFK: "bat"
          }
        },
        instructions: [
          {
            parent         : "foo",
            parentKey      : "bat",
            child          : "bat",
            childKey       : "id",
            select         : ["color_g", "color_h", "color_i", "id", "createdAt", "updatedAt"],
            alias          : "bat",
            removeParentKey: true,
            model          : true,
            collection     : false,
            criteria       : {"where": {}}
          }
        ]
      }
    }
  },

  // Expected results per query method.
  expected   : {

    // Sequel.select()
    select: {

      // The queryString we expect to be rendered after calling `Sequel.select()`
      queryString    : 'SELECT `foo`.`color`, `foo`.`id`, `foo`.`createdAt`, `foo`.`updatedAt`, `foo`.`bar`, `foo`.`bat`, `foo`.`baz`, `__bat`.`color_g` AS `bat___color_g`, `__bat`.`color_h` AS `bat___color_h`, `__bat`.`color_i` AS `bat___color_i`, `__bat`.`id` AS `bat___id`, `__bat`.`createdAt` AS `bat___createdAt`, `__bat`.`updatedAt` AS `bat___updatedAt` FROM `foo` AS `foo` ',

      // The number of queries that will be returned after calling Sequel.select()
      queriesReturned: 1,
    },

    // Sequel.find()
    find  : {

      // The queryString we expect to be rendered after calling `Sequel.select()`
      queryString    : 'SELECT `foo`.`color`, `foo`.`id`, `foo`.`createdAt`, `foo`.`updatedAt`, `foo`.`bar`, `foo`.`bat`, `foo`.`baz`, `__bat`.`color_g` AS `bat___color_g`, `__bat`.`color_h` AS `bat___color_h`, `__bat`.`color_i` AS `bat___color_i`, `__bat`.`id` AS `bat___id`, `__bat`.`createdAt` AS `bat___createdAt`, `__bat`.`updatedAt` AS `bat___updatedAt` FROM `foo` AS `foo`  LEFT OUTER JOIN `bat` AS `__bat` ON `foo`.`bat` = `__bat`.`id` ',

      // The number of queries that will be returned after calling Sequel.select()
      queriesReturned: 1
    }
  }
};
