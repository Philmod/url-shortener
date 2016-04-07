const _ = require('lodash');

const errors = require('../lib/errors');

/**
 * error handler of the api
 */

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.log('ERROR : ', err.code, err, err.stack)

  res.status(err.code).send({error: err});
};
