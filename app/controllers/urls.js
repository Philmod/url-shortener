const path = require('path');

module.exports = (app) => {

  const index = (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../views/index.html'));
  }

  return {
    index: index
  }
}
