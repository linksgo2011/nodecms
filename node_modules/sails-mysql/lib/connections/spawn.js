// Dependencies
var mysql = require('mysql');

var STRINGFILE = {
  noCallbackError: 'An error occurred in the MySQL adapter, but no callback was specified to the spawnConnection function to handle it.'
};



/**
 * Wrap a function in the logic necessary to provision a connection.
 * (either grab a free connection from the pool or create a new one)
 *
 * cb is optional (you might be streaming), but... TODO:
 *    if streaming, pass in the stream instead of the callback--
 *    then any relevant `error` events can be emitted on the stream.
 *
 * @param  {Object}   connectionObject
 * @param  {Function} fn
 * @param  {[type]}   cb__spawnConnection
 */

module.exports = function spawnConnection (connectionObject, fn, cb__spawnConnection) {

  //
  // TODO:
  //
  // Add app-side "soft" connection timeout if necessary.
  //
  // See mike's comment in node-mysql:
  //  + https://github.com/felixge/node-mysql/pull/717#issuecomment-33877721
  // Also see the issue on pool conncetion timeouts:
  //  + https://github.com/felixge/node-mysql/issues/424
  //

  // If pooling is used, grab a connection from the pool and run the
  // logic for the query.
  if (connectionObject.connection.pool) {
    connectionObject.connection.pool.getConnection(function (err, conn) {
      afterwards(err, conn);
    });
    return;
  }

  // Use a new connection each time
  var conn = mysql.createConnection(connectionObject.config);
  conn.connect(function (err) {
    afterwards(err, conn);
  });
  return;



  /**
   * Run the actual query logic (`fn`) now that we have our live connection,
   * and release/close the connection when finished.
   *
   * @param  {[type]} err            [description]
   * @param  {[type]} liveConnection [description]
   * @return {[type]}                [description]
   */
  function afterwards(err, liveConnection) {

    // Handle connection errors
    if (err) {

      //
      // TODO:
      // Cast the error using `waterline-errors`
      // ("could not connect")
      //
      err = new Error( 'Could not connect to MySQL:\n' + err.toString());

      // Try to release the connection, if it exists:
      connectionObject.connection.releaseConnection(liveConnection, function dontWaitForThis(){ });

      // But trigger the callback immediately (don't wait for the connection to be released)
      return cb__spawnConnection(err);
    }

    // Now that we have the live connection, run our adapter logic.
    // i.e. run `fn`, a function which, amongst other things, should do something
    // with the live MySQL connection (probably send a query).
    fn(liveConnection, function(err, result) {

      // Handle errors passed back from our adapter logic.
      if (err) {

        // Release the connection, then pass control back to Waterline core.
        connectionObject.connection.releaseConnection(liveConnection, function sendBackError ( /* thisErrDoesntMatter */ ) {
          cb__spawnConnection(err);
        });
        return;
      }


      // If we made it here, our adapter logic came back without an error,
      // so we release the connection and trigger our callback.
      connectionObject.connection.releaseConnection(liveConnection, function (err) {

        // If an error occurred releasing the connection handle it here:
        // (note that this is unlikely, and would indicate unexpected behavior)
        if (err) {

          //
          // TODO:
          // Cast the error using `waterline-errors`
          // ("could not release connection")
          //
          return cb__spawnConnection(err);
        }

        // Success (done.)
        return cb__spawnConnection(null, result);
      });
    });

  }
};
