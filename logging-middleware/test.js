const log = require('./index');

// Example: test logging a DB error
log('backend', 'fatal', 'db', 'Critical database connection failure.');

// Example: test logging a validation error
log('backend', 'error', 'handler', 'received string, expected bool');
