import Handler from "../entities/handler.js";
import http_status_codes from "../../data/sources/http_status_codes.js";

/**
 * @typedef {import("../entities/types.js").ResponseModel} ResponseModel
 */

/**
 * @typedef {import("../entities/types.js").HttpRequest} HttpRequest
 */

/**
 *
 * @param {any[]} array
 * @param {any} item
 */
export function addToArray(array, item) {
  if (array === undefined || Array.isArray(array) === false) {
    throw new Error(`No array provided to ${addToArray.name}`);
  }

  if (!item) {
    throw new Error(`No valid item provided to ${addToArray.name}`);
  }

  if (array.includes(item)) {
    throw new Error(`Item already exists in array`);
  }

  return array.push(item);
}

/**
 *
 * @param {Handler[]} middleware
 * @param {HttpRequest} request
 * @param {ResponseModel} response_model
 */
export function executeMiddleware(middleware, request, response_model) {
  for (let i = 0; i < middleware.length; i++) {
    const middleware_item = middleware[i];
    middleware_item.handler_function(request, response_model);
  }
}

/**
 *
 * @param {string} url
 * @param {ResponseModel} response_model
 * @returns validated URL
 */
export function validateRequestUrl(url, response_model) {
  if (!url) {
    response_model.setStatus(http_status_codes.codes.BAD_REQUEST);
    response_model.writeHtml(`URL was not provided in Request: [${url}]`);
    return;
  }
  return url;
}

/**
 *
 * @param {string} method
 * @param {ResponseModel} response_model
 */
export function validateRequestMethod(method, response_model) {
  if (!method) {
    response_model.setStatus(http_status_codes.codes.BAD_REQUEST);
    response_model.writeHtml(`Request method was not provided: [${method}]`);
    return;
  }
  return method;
}
