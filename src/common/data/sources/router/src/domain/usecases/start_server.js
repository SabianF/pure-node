/**
 * @typedef {import("../entities/router.js").default} Router
 */

/**
 * @typedef {import("../repositories/routing.js").default} RoutingRepo
 */

/**
 * @typedef {import("../entities/types.js").Server} Server
 */

/**
 * @callback ListenerHandlerFunction
 * @param {Error} error
 */

/**
 * @callback StartServerFunction
 * @param {object} props
 * @param {Server} props.server
 * @param {number} props.port
 * @param {ListenerHandlerFunction} props.listen_handler
 */

/**
 * @type {StartServerFunction}
 */
export default function startServer({
  server,
  port,
  listen_handler,
}) {
  return server.listen(port, listen_handler);
}
