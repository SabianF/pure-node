import http from "http";

const valid_methods = [
  "GET",
  "POST",
];

export default class Router {
  /**
   * @type {Handler[]}
   */
  handlers;

  constructor() {
    this.handlers = [];
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

  #addHandler(handler, handler_function) {
    if (this.handlers.includes(handler)) {
      throw new Error(`Handler has already been added: [${handler_function}]`);
    }

    this.handlers.push(handler);
  }

  /**
   *
   * @param {number} port
   * @param {function()} listener_handler
   */
  listen(port, listener_handler) {
    const server = http.createServer(async (request, response) => {
      if (!request.url) {
        response.write(`URL was not provided in Request: [${request.url}]`);
        response.end();
      }
      const normalized_url = request.url;

      if (!request.method) {
        response.write(`Method was not provided in Request: [${request.url}]`);
        response.end();
        return;
      }
      const normalized_method = request.method.toUpperCase();

      for (let i = 0; i < this.handlers.length; i++) {
        const handler = this.handlers[i];

        if (handler.url === normalized_url) {
          continue;
        }

        if (handler.method !== normalized_method) {
          continue;
        }

        response.setHeader("Content-Type", "text/html; charset=utf-8");

        await handler.handler_function(request, response);
        response.end();
        break;
      }
    });

    server.listen(port, listener_handler);
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
