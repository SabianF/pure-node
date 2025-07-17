/**
 * @typedef {import("http").ClientRequest} HttpRequest
 */

/**
 * @typedef {import("http").ServerResponse<HttpRequest>} HttpResponse
 */

/**
 * @callback HttpRequestHandler
 * @param {HttpRequest} request
 * @param {HttpResponse} response
 * @returns {*}
 */
