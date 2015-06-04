/**
 * Module dependencies
 */



module.exports = {};


module.exports.configure = function ( connections ) {

 /**
   * Teardown a MySQL connection.
   * (if the Waterline "connection" is using a pool, also `.end()` it.)
   *
   * @param  {String}   connectionName  [name of the Waterline "connection"]
   * @param  {Function} cb
   */
  return function teardown (connectionName, cb) {

    function closeConnection(name) {
      // Drain the MySQL connection pool for this Waterline Connection
      // (if it's in use.)

      if ( connections[name] && connections[name].connection && connections[name].connection.pool ) {
        // console.log('Ending pool for ' + connectionName);
        connections[name].connection.pool.end();
      }

      // Make sure memory is freed by removing this stuff from our
      // global set of WL Connections.
      delete connections[name];
    }

    // If no connection name was given, teardown all the connections
    if(!connectionName) {
      Object.keys(connections).forEach(function(conn) {
        closeConnection(conn);
      });
    }

    // Else only teardown a single connection
    else {
      closeConnection(connectionName);
    }

    return cb();

  };

};
