import http from "http";
import Handler from "./handler.js";
import { addToArray, handleError, handleRequest } from "../repositories/utilities.js";
import createRequestHandler from "../repositories/request_handler.js";

export default class Router {
  /**
   * The handle all requests
   * @type {Handler[]}
   */
  handlers;

  /**
   * @type {handleError[]}
   */
  endware;

  constructor() {
    this.handlers = [];
    this.endware = [];
  }

  /**
   * Adds middleware, by creating a handler containing the handler_function and adding it to the handler array
   * @param {handleRequest} handler_function
   */
  use(handler_function) {
    addToArray(
      this.handlers,
      new Handler({
        is_middleware: true,
        handler_function: handler_function,
      }),
    );
  }

  /**
   * Adds a GET route which executes the provided handler_function
   * @param {string} url
   * @param {handleRequest} handler_function
   */
  get(url, handler_function) {
    addToArray(
      this.handlers,
      new Handler({
        method: this.get.name.toUpperCase(),
        url: url,
        handler_function: handler_function,
      }),
    );
  }

  /**
   *
   * @param {handleError} endware_handler_function
   */
  useAfterAll(endware_handler_function) {
    addToArray(this.endware, endware_handler_function);
  }

  /**
   *
   * @param {number} port
   * @param {handleRequest} listen_handler
   */
  listen(port, listen_handler) {
    const request_handler = createRequestHandler(this.handlers, this.endware);
    const server = http.createServer(request_handler);

    server.listen(port, listen_handler);
  }
}
