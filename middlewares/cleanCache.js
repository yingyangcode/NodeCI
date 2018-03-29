const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // wait for route handler to execute
  await next();
  // clear hash after request handler is done
  clearHash(req.user.id);
};