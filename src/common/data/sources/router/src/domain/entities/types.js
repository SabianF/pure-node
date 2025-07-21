/**
 * @callback HttpRequestHandler
 * @param {HttpRequest} request
 * @param {ResponseModel} response
 */

/**
 * @typedef {import("../../data/sources/http_lib.js").HttpRequest} HttpRequest
 */

/**
 * @typedef {import("../../data/models/response.js").default} ResponseModel
 */

/**
 * @typedef {import("../../data/sources/http_lib.js").HttpResponse} HttpResponse
 */

/**
 * @typedef {import("../../data/sources/http_lib.js").default.Server} Server
 */

/**
 * @typedef {import("../../data/repositories/http_repo.js").default} HttpRepo
 */

/**
 * @typedef {import("../../data/repositories/file_system.js").default} FileSystemRepo
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
 * @param {import("./request_error.js").default} error
 * @param {HttpRequest} request
 * @param {HttpResponse} response
 * @returns {Promise<any>}
 */
