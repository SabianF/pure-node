import http from "node:http";

export default class HttpLib {
  /**
   *
   * @param {http.RequestListener} request_listener 
   */
  createServer(request_listener) {
    return http.createServer(request_listener);
  }
}
