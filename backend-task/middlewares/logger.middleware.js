const {log} = require('../../logging-middleware'); // path to your custom log module

const logger = (req, res, next) => {
  log('backend', 'info', 'middleware', `Incoming request: ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logger;
