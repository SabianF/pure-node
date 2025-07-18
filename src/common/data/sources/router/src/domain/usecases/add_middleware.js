/**
 *
 * @param {import("../../data/models/router.js").default} router_model
 * @param {import("./handle_static.js").RequestHandlerFunction} handler_function
 */
export default function addMiddleware(router_model, handler_function) {
  return router_model.use(handler_function);
}
