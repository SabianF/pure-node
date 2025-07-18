import HttpLib from "../sources/http_lib.js";

/**
 * @typedef HttpRepoProps
 * @property {HttpLib} http_lib
 */

export default class HttpRepo {
  /**
   * @type {HttpLib}
   */
  #http_lib;

  /**
   *
   * @param {HttpRepoProps} props
   */
  constructor({
    http_lib,
  }) {
    this.#http_lib = http_lib;
  }

  createServer(handler) {
    return this.#http_lib.createServer(handler);
  }
}
