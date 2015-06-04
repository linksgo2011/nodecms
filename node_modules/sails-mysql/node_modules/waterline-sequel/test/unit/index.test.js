var assert  = require('chai').assert,
    Sequel  = require('../../sequel'),
    schema  = require('../schema'),
    options = require('../options'),
    queries = require('../queries');

describe('Sequel', function () {
  describe('constructor', function () {
    context('Without any arguments', function () {
      it('Should return an instance of Sequel', function (done) {
        var sequel = new Sequel();

        assert.instanceOf(sequel, Sequel);
        done();
      });
    });

    context('With arguments', function () {
      it('Should return an instance of Sequel', function (done) {
        var sequel = new Sequel(schema, options);

        assert.instanceOf(sequel, Sequel);
        done();
      });
    });
  });

  describe('.select()', function () {
    // Loop through the query objects and test them against the `.select()` method.
    // You can find the instructions in `test/queries`
    queries.forEach(function (query) {
      it(query.description, function (done) {
        var sequel      = new Sequel(schema, options),
            selectQuery = sequel.select(query.table, query.query);

        assert.property(selectQuery, 'select');
        assert.isArray(selectQuery.select);
        assert.lengthOf(selectQuery.select, query.expected.select.queriesReturned);
        assert.strictEqual(selectQuery.select[0], query.expected.select.queryString);

        done();
      });
    });
  });

  describe('.find()', function () {
    // Loop through the query objects and test them against the `.find()` method.
    // You can find the instructions in `test/queries`
    queries.forEach(function (query) {
      it(query.description, function (done) {
        var sequel    = new Sequel(schema, options),
            findQuery = sequel.find(query.table, query.query);

        assert.property(findQuery, 'query');
        assert.isArray(findQuery.query);
        assert.lengthOf(findQuery.query, query.expected.find.queriesReturned);
        assert.strictEqual(findQuery.query[0], query.expected.find.queryString);

        done();
      });
    });
  });
});
