const _ = require('lodash');

const errors = require('../lib/errors');

/**
 * Error handler of the api
 */
module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.log('ERROR : ', err.code, err, err.stack)
  res.status(err.code).send({error: err});
};
