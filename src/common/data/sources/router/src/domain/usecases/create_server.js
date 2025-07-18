import createRequestHandler from "../repositories/request_handler.js";

/**
 *
 * @param {import("../../data/repositories/http_repo.js").default} http_repo
 * @param {import("../../data/models/router.js").default} router
 */
export default function createServer(http_repo, router) {
  const request_handler = createRequestHandler(
    router.getRequestHandlers(),
    router.getErrorHandlers(),
  );
  const server = http_repo.createServer(request_handler);
  return server;
}
