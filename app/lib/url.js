const config = require('config');

module.exports = {

  /**
   * Given an id, construct a short url.
   *
   * @param {String} id
   * @return {String} Url
   */
  constructShortUrl: id => {
    var url = [config.protocol, '://', config.domain].join('')
    url += (config.port) ? (':' + config.port) : '';
    url += ['/', id].join('');
    return url;
  }

}
