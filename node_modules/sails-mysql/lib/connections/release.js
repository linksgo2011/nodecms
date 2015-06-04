/**
 * Module dependencies
 */

var Errors = require('waterline-errors').adapter;

/**
 * Functions for freeing/terminating a MySQL connection when a query is complete.
 *
 * @type {Object}
 */
module.exports = {

  /**
   * Frees the MySQL connection back into the pool.
   *
   * @param  {MySQLConnection}   conn
   * @param  {Function} cb   [description]
   */
  poolfully: function(conn, cb) {
    if (!conn || typeof conn.release !== 'function') {
      return cb(Errors.ConnectionRelease);
    }

    // Don't wait for connection release to trigger this callback.
    // (TODO: evaluate whether this should be the case)
    conn.release();
    return cb();
  },


  /**
   * Terminates the MySQL connection.
   *
   * @param  {MySQLConnection}   conn
   * @param  {Function} cb
   */
  poollessly: function(conn, cb) {
    if (!conn || typeof conn.end !== 'function') {
      return cb(Errors.ConnectionRelease);
    }

    // Wait for the connection to be ended, then trigger the callback.
    conn.end(cb);
  }
};
