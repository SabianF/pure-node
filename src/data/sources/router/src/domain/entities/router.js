import http from "http";
import Handler from "./handler.js";
import { addToArray, handleError } from "../repositories/utilities.js";
import handleHttpRequests from "../repositories/server_listener.js";

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
   *
   * @param {handleRequest} handler_function
   */
  use(handler_function) {
    addToArray(this.handlers, new Handler({
      is_middleware: true,
      handler_function: handler_function,
    }));
  }

  /**
   *
   * @param {string} method
   * @param {handleRequest} handler_function
   */
  get(url, handler_function) {
    addToArray(this.handlers, new Handler({
      method: this.get.name.toUpperCase(),
      url: url,
      handler_function: handler_function,
    }));
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
   * @param {handleRequest} listener_handler
   */
  listen(port, listener_handler) {
    const server = http.createServer(
      handleHttpRequests(
        this.handlers,
        this.endware,
      ),
    );

    server.listen(port, listener_handler);
  }
}
