const crypto = require('crypto');

const generateShortcode = () => {
  return crypto.randomBytes(3).toString('hex'); // 6-character shortcode
};

module.exports = generateShortcode;
