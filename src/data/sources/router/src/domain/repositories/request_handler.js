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
    const normalized_url = validateRequestUrl(request.url, response);
    const normalized_method = validateRequestMethod(request.method, response);

    let was_handled = false;
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];

      if (handler.is_middleware) {
        handler.handler_function(request, response);
        continue;
      }

      if (handler.url !== normalized_url) {
        continue;
      }

      if (handler.method !== normalized_method) {
        continue;
      }

      was_handled = true;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      await handler.handler_function(request, response);
      executeEndware(endware, request, response);
      response.end();
      break;
    }

    if (response.writableEnded) {
      return;
    }

    executeEndware(request, response);
    handleNotFound(null, request, response);
    response.end();
  };

  return request_handler;
}
