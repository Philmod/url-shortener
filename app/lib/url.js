const config = require('config');

module.exports = {

  constructShortUrl: id => {
    var url = [config.protocol, '://', config.domain].join('')
    url += (config.port) ? (':' + config.port) : '';
    url += ['/', id].join('');
    return url;
  }

}
