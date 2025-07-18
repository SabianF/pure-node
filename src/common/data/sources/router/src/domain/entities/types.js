/**
 * @typedef {import("../../data/sources/http_lib.js").default.Server} Server
 */

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
 * @returns {Promise<any>}
 */

/**
 * @callback ErrorHandlerFunction
 * @param {Error} error
 * @param {HttpRequest} request
 * @param {HttpResponse} response
 * @returns {Promise<any>}
 */
