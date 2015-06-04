/**
 * All errors an adapter could potentially return
 */

module.exports = {
  // Primary key errors
  PrimaryKeyUpdate: 'Primary key cannot be updated',
  PrimaryKeyMissing: 'Primary key was not set and is not auto increment',
  PrimaryKeyCollision: 'A record with that primary key has already been created',

  // Not found
  NotFound: 'Record with the provided criteria was not found',

  // Uniqueness
  NotUnique: 'Record does not satisfy unique constraints',

  // Not registered
  CollectionNotRegistered: 'Unable to find registered collection',

  // Group by criteria not present
  InvalidGroupBy: 'Cannot groupBy without a calculation',

  // Authentication failure
  AuthFailure: 'Could not authenticate using credentials provided',

  // Invalid attribute passed that is auto increment
  InvalidAutoIncrement: 'An attribute that is auto increment cannot be set',

  // Invalid connection name passed
  InvalidConnection: 'Invalid connection name specified',

  ConnectionRelease: 'Connection not released because it was never acquired or already released',

  // Connection identity missing
  IdentityMissing: 'Connection is missing an identity',

  // Connection collision
  IdentityDuplicate: 'Connection is already registered'
};