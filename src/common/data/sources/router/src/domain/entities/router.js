/**
 * @typedef {import("./handler.js").default} Handler
 */

export default class Router {
  /**
   * The handle all requests
   * @type {Handler[]}
   */
  #request_handlers;

  /**
   * @type {ErrorHandlerFunction[]}
   */
  #error_handlers;

  constructor() {
    this.#request_handlers = [];
    this.#error_handlers = [];
  }

  getRequestHandlers() {
    return this.#request_handlers;
  };

  getErrorHandlers() {
    return this.#error_handlers;
  }
}
