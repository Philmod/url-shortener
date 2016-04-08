const url = require('url');

/**
 * Get service's url component.
 *
 * @param {String} service
 * @return {Object} Url's components
 */
const parseUrl = service => {
  const fullUrl = process.env[service.toUpperCase() + '_PORT'];
  if (!fullUrl) {
    return {};
  } else {
    return url.parse(fullUrl);
  }
}

module.exports = {

  /**
   * Get service Host.
   *
   * @param {String} service
   * @return {String} Host
   */
  getHost: (service) => {
    return parseUrl(service).hostname;
  },

  /**
   * Get service Port.
   *
   * @param {String} service
   * @return {String} Port
   */
  getPort: (service) => {
    return parseUrl(service).port;
  },

  /**
   * Get service Protocol.
   *
   * @param {String} service
   * @return {String} Protocol
   */
  getProtocol: (service) => {
    return parseUrl(service).tcp;
  },

}
