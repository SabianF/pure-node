import http from "node:http";
import Handler from "../entities/handler.js";
import {
  executeEndware,
  handleError,
  handleNotFound,
  validateRequestMethod,
  validateRequestUrl,
} from "./utilities.js";

/**
 *
 * @param {Handler[]} handlers
 * @param {handleError[]} endware
 */
export default function createRequestHandler(handlers, endware) {
  /**
   *
   * @param {http.ClientRequest} request
   * @param {http.ServerResponse<http.ClientRequest>} response
   */
  const request_handler = async (request, response) => {
    response.setHeader("Content-Type", "text/html; charset=utf-8");

    const normalized_url = validateRequestUrl(request.url, response);
    const normalized_method = validateRequestMethod(request.method, response);

    await executeHandlers(
      handlers,
      normalized_url,
      normalized_method,
      request,
      response,
    );

    executeEndware(request, response);

    if (response.writableEnded) {
      return;
    }

    handleNotFound(null, request, response);
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
 */
async function executeHandlers(
  handlers,
  normalized_url,
  normalized_method,
  request,
  response,
) {
  for (let i = 0; i < handlers.length; i++) {
    const handler = handlers[i];

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
    break;
  }
}
