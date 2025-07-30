import Result from "../../domain/entities/result.js";
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

  /**
   *
   * @param {import("../sources/http_lib.js").HttpRequestHandler} handler
   */
  createServer(handler) {
    try {
      const server = this.#http_lib.createServer(handler);

      return new Result({
        data: server,
      });

    } catch (error) {
      return new Result({
        error: error,
      });
    }
  }
}
