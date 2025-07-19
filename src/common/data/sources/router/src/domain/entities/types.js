/**
 * @typedef {import("../../data/sources/http_lib.js").HttpRequestHandler} HttpRequestHandler
 */

/**
 * @typedef {import("../../data/sources/http_lib.js").HttpRequest} HttpRequest
 */

/**
 * @typedef {import("../../data/sources/http_lib.js").HttpResponse} HttpResponse
 */

/**
 * @typedef {import("../../data/sources/http_lib.js").default.Server} Server
 */

/**
 * @typedef {import("../../data/repositories/repositories.js").default} DataRepos
 */

/**
 * @typedef {import("../../data/models/router.js").default} RouterModel
 */

/**
 * @typedef {import("../../domain/repositories/repositories.js").default} DomainRepos
 */

/**
 * @typedef {import("../repositories/routing.js").default} RoutingRepo
 */

/**
 * @typedef {import("./handler.js").default} Handler
 */

/**
 * @typedef {import("./router.js").default} Router
 */

/**
 * @callback ErrorHandlerFunction
 * @param {Error} error
 * @param {HttpRequest} request
 * @param {HttpResponse} response
 * @returns {Promise<any>}
 */
