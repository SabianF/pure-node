import http from "http";
import HttpStatusCodes from "./packages/http_status_codes.js";

const valid_methods = [
  "GET",
  "POST",
];

export default class Router {
  /**
   * These run before any requests are handled
   * @type {Handler[]}
   */
  middleware;

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
    this.middleware = [];
    this.handlers = [];
    this.endware = [];
  }

  /**
   *
   * @param {handleRequest} handler_function
   */
  use(handler_function) {
    this.#addMiddleware(new Handler({
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
    this.#addHandler(new Handler({
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
    const already_exists = this.endware.includes(endware_handler_function);
    if (already_exists) {
      throw new Error(`Endware already exists: [${endware_handler_function}]`);
    }

    this.endware.push(endware_handler_function);
  }

  /**
   *
   * @param {Handler} handler
   */
  #addHandler(handler) {
    if (this.handlers.includes(handler)) {
      throw new Error(`Handler has already been added: [${handler.handler_function}]`);
    }

    this.handlers.push(handler);
  }

  /**
   *
   * @param {Handler} handler
   */
  #addMiddleware(handler) {
    if (this.middleware.includes(handler)) {
      throw new Error(`Middleware has already been added: [${handler.handler_function}]`);
    }

    this.middleware.push(handler);
  }

  /**
   *
   * @param {number} port
   * @param {function()} listener_handler
   */
  listen(port, listener_handler) {
    const server = http.createServer(async (request, response) => {
      this.#executeMiddleware(request, response);
      const normalized_url = this.#validateRequestUrl(request.url, response);
      const normalized_method = this.#validateRequestMethod(request.method, response);;

      let was_handled = false;
      for (let i = 0; i < this.handlers.length; i++) {
        const handler = this.handlers[i];

        if (handler.url !== normalized_url) {
          continue;
        }

        if (handler.method !== normalized_method) {
          continue;
        }

        was_handled = true;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        await handler.handler_function(request, response);
        this.#executeEndware(request, response);
        response.end();
        break;
      }

      if (response.writableEnded) {
        return;
      }

      this.#executeEndware(request, response);
      handleNotFound(null, request, response);
      response.end();
    });

    server.listen(port, listener_handler);
  }

  #executeEndware(request, response) {
    for (let i = 0; i < this.endware.length; i++) {
      const endware_item = this.endware[i];
      endware_item(null, request, response);
    }
  }

  #executeMiddleware(request, response) {
    for (let i = 0; i < this.middleware.length; i++) {
      const middleware_item = this.middleware[i];
      middleware_item.handler_function(request, response);
    }
  }

  #validateRequestMethod(method, response) {
    if (!method) {
      response.write(`Request method was not provided: [${method}]`);
      response.end();
      return;
    }
    return method;
  }

  /**
   *
   * @param {string} url
   * @param {https.ServerResponse<http.ClientRequest>} response
   * @returns validated URL
   */
  #validateRequestUrl(url, response) {
    if (!url) {
      response.write(`URL was not provided in Request: [${url}]`);
      response.end();
      return;
    }
    return url;
  }
}

class Handler {
  /**
   * @type {string} HTTP request method type (e.g. `GET`, `POST`, etc)
   */
  method;

  /**
   * @type {string}
   */
  url;

  /**
   * @type {boolean}
   */
  is_middleware;

  /**
   * @type {handleRequest}
   */
  handler_function;

  /**
   *
   * @param {object} props
   * @param {string} props.method
   * @param {string} props.url
   * @param {handleRequest} props.handler_function
   * @param {boolean} [props.is_middleware]
   */
  constructor({
    method,
    url,
    handler_function,
    is_middleware,
  }) {
    if (!is_middleware) {
      this.method = validateMethod(method);
      this.url = validateUrl(url);
    }

    this.handler_function = handler_function;
  }
}

/**
 *
 * @param {string} method
 */
function validateMethod(method) {
  const normalized_method = method.trim().toUpperCase();

  const isNotValid = valid_methods.includes(normalized_method) === false;
  if (isNotValid) {
    throw new Error(`Invalid method provided [${normalized_method}]. Valid methods are ${JSON.stringify(valid_methods, " ", 2)}.`);
  }

  return normalized_method;
}

function validateUrl(url) {
  const normalized_url = URL.parse(`https://localhost:3333${url}`).pathname;

  if (!normalized_url) {
    throw new Error(`Invalid URL provided to Router: [${url}]`);
  }

  return normalized_url;
}

/**
 *
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export async function handleRequest(request, response) { }

/**
 *
 * @param {Error} error
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export async function handleError(error, request, response) { }

/**
 *
 * @param {Error} error
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
async function handleNotFound(error, request, response) {
  if (!error) {
    error = new Error(HttpStatusCodes.reasons.NOT_FOUND);
  }

  response.statusCode = HttpStatusCodes.codes.NOT_FOUND;
  response.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"  content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible"  content="ie=edge">
        <title>${error.message}</title>
      </head>
      <body>
        <h1>${error.message}: ${request.url}</h1>
      </body>
    </html>
  `);
}
