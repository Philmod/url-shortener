const _ = require('lodash');

const errors = require('../lib/errors');

/**
 * error handler of the api
 */

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.code).send({error: err});
};
