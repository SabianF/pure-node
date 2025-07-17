import http from "node:http";
import Handler from "../entities/handler.js";
import {
  handleError,
  validateRequestMethod,
  validateRequestUrl,
} from "./utilities.js";
import http_status_codes from "../../data/sources/http_status_codes.js";

/**
 *
 * @param {Handler[]} handlers
 * @param {handleError[]} error_handlers
 */
export default function createRequestHandler(handlers, error_handlers) {
  /**
   *
   * @param {http.ClientRequest} request
   * @param {http.ServerResponse<http.ClientRequest>} response
   */
  const request_handler = async (request, response) => {
    response.setHeader("Content-Type", "text/html; charset=utf-8");

    const normalized_url = validateRequestUrl(request.url, response);
    const normalized_method = validateRequestMethod(request.method, response);

    /**
     * @type {Error}
     */
    let err;

    await executeHandlers(
      handlers,
      normalized_url,
      normalized_method,
      request,
      response,
      err,
    );

    if (response.writableEnded) {
      return;
    }

    executeErrorHandlers(error_handlers, err, request, response);

    response.end();
  };

  return request_handler;
}

/**
 *
 * @param {Handler[]} handlers
 * @param {string} normalized_url
 * @param {string} normalized_method
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 * @param {Error} error
 */
async function executeHandlers(
  handlers,
  normalized_url,
  normalized_method,
  request,
  response,
  error,
) {
  for (const handler of handlers) {
    if (response.writableEnded) {
      break;
    }

    if (handler.is_middleware) {
      await handler.handler_function(request, response);
      continue;
    }

    if (handler.url !== normalized_url) {
      continue;
    }

    if (handler.method !== normalized_method) {
      continue;
    }

    await handler.handler_function(request, response);
    response.end();
    return;
  }

  error = new Error("Not found");
}

/**
 *
 * @param {handleError[]} error_handlers
 * @param {Error} err
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export function executeErrorHandlers(error_handlers, err, request, response) {
  for (let i = 0; i < error_handlers.length; i++) {
    if (err) {
      break;
    }

    const error_handler = error_handlers[i];
    error_handler(err, request, response);
  }

  if (response.writableEnded) {
    return;
  }

  handleNotFound(request, response);
}

/**
 *
 * @param {Error} error
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export async function handleNotFound(request, response) {
  const message = http_status_codes.reasons.NOT_FOUND;
  response.statusCode = http_status_codes.codes.NOT_FOUND;
  response.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"  content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible"  content="ie=edge">
        <title>${message}</title>
      </head>
      <body>
        <h1>${message}: ${request.url}</h1>
      </body>
    </html>
  `);
}
