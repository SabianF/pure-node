/**
 *
 * @param {import("../entities/types.js").RoutingRepo} routing_repo
 * @param {import("../entities/types.js").RouterModel} router
 */
export default function createServer(routing_repo, router) {
  const server = routing_repo.createServer(router);
  return server;
}
