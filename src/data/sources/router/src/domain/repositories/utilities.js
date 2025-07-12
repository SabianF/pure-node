import http from "node:http";
import HttpStatusCodes from "../../../../packages/http_status_codes.js";
import Handler from "../entities/handler.js";

/**
 *
 * @param {Request} request
 * @param {Response} response
 */
export async function handleRequest(request, response) {}

/**
 *
 * @param {Error} error
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export async function handleError(error, request, response) {}

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
 * @param {handleError[]} endware
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export function executeEndware(endware, request, response) {
  for (let i = 0; i < endware.length; i++) {
    const endware_item = endware[i];
    endware_item(null, request, response);
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

/**
 *
 * @param {Error} error
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export async function handleNotFound(error, request, response) {
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
