const axios = require('axios');

const log = async (stack, level, pkg, message) => {
  try {
    const logData = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message
    };

    const res = await axios.post('http://20.244.56.144/evaluation-service/logs', logData);
    console.log(`[LOG] ${res.data.message} - ID: ${res.data.logID}`);
  } catch (err) {
    console.error('Failed to send log:', err.message);
  }
};

module.exports = { log }
