ROOT=$(shell pwd)

test: test-unit

test-unit:
	@echo "\nRunning unit tests..."
	@NODE_ENV=test ./node_modules/.bin/mocha test/unit test/queries --recursive
  
test-integration:
	@echo "\nRunning integration tests..."
	rm -rf node_modules/sails-postgresql/node_modules/waterline-sequel
	ln -s $(ROOT) node_modules/sails-postgresql/node_modules/waterline-sequel
	rm -rf node_modules/sails-mysql/node_modules/waterline-sequel
	ln -s $(ROOT) node_modules/sails-mysql/node_modules/waterline-sequel
	@NODE_ENV=test node test/integration/runnerDispatcher.js