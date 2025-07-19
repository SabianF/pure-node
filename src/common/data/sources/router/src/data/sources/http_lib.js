import http from "node:http";

/**
 * @typedef {http.IncomingMessage} HttpRequest
 */

/**
 * @typedef {http.ServerResponse<HttpRequest>} HttpResponse
 */

/**
 * @typedef {http.RequestListener} HttpRequestHandler
 */

export default class HttpLib {
  /**
   *
   * @param {http.RequestListener} request_listener
   */
  createServer(request_listener) {
    return http.createServer(request_listener);
  }
}
