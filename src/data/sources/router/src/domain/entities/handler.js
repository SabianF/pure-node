const valid_methods = [
  "GET",
  "POST",
];

export default class Handler {
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
      this.method = this.#validateMethod(method);
      this.url = this.#validateUrl(url);
    }

    this.is_middleware = is_middleware;
    this.handler_function = handler_function;
  }

  /**
   *
   * @param {string} method
   */
  #validateMethod(method) {
    const normalized_method = method.trim().toUpperCase();

    const isNotValid = valid_methods.includes(normalized_method) === false;
    if (isNotValid) {
      throw new Error(`Invalid method provided [${normalized_method}]. Valid methods are ${JSON.stringify(valid_methods, " ", 2)}.`);
    }

    return normalized_method;
  }

  #validateUrl(url) {
    const normalized_url = URL.parse(`https://localhost:3333${url}`).pathname;

    if (!normalized_url) {
      throw new Error(`Invalid URL provided to Router: [${url}]`);
    }

    return normalized_url;
  }
}
