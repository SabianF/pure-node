import http from "node:http";
import Handler from "../entities/handler.js";

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

  array.push(item);
}

/**
 *
 * @param {Handler[]} middleware
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export function executeMiddleware(middleware, request, response) {
  for (let i = 0; i < middleware.length; i++) {
    const middleware_item = middleware[i];
    middleware_item.handler_function(request, response);
  }
}

/**
 *
 * @param {string} url
 * @param {https.ServerResponse<http.ClientRequest>} response
 * @returns validated URL
 */
export function validateRequestUrl(url, response) {
  if (!url) {
    response.write(`URL was not provided in Request: [${url}]`);
    response.end();
    return;
  }
  return url;
}

/**
 *
 * @param {string} method
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export function validateRequestMethod(method, response) {
  if (!method) {
    response.write(`Request method was not provided: [${method}]`);
    response.end();
    return;
  }
  return method;
}
