import http from "node:http";
import HttpStatusCodes from "../../../../packages/http_status_codes.js";

/**
 *
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export async function handleRequest(request, response) { }

/**
 *
 * @param {Error} error
 * @param {http.ClientRequest} request
 * @param {http.ServerResponse<http.ClientRequest>} response
 */
export async function handleError(error, request, response) { }

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
