/**
 *
 * @param {import("../../data/repositories/http_repo.js").default} http_repo
 * @param {import("../../data/models/router.js").default} router_model
 */
export default function createServer(http_repo, router_model) {
  const request_handler = createRequestHandler(
    router_model.getRequestHandlers(),
    router_model.getErrorHandlers(),
  );
  const server = http_repo.createServer(request_handler);
  return server.listen(port, listen_handler);
}
