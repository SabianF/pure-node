import Handler from "../entities/handler.js";
import { addToArray } from "../repositories/utilities.js";

/**
 *
 * @param {import("../entities/router.js").default} router
 * @param {import("./handle_static.js").HttpRequestHandler} handler_function
 */
export default function addMiddleware(router, handler_function) {
  const handler = new Handler({
    is_middleware: true,
    handler_function: handler_function,
  });

  return addToArray(
    router.request_handlers,
    handler,
  );
}
