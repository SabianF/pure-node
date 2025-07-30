import { addToArray } from "../repositories/utilities.js";
/**
 * @typedef {import("../entities/router.js").default} Router
 * @typedef {import("../entities/types.js").ErrorHandlerFunction} ErrorHandlerFunction
 * @typedef {import("../entities/types.js").Result} Result
 */

/**
 *
 * @param {Object} props
 * @param {Router} props.router
 * @param {ErrorHandlerFunction} props.error_handler_function
 * @returns {Result} {data: Number} Updated number of handlers
 */
export default function addErrorHandler({
  router,
  error_handler_function,
}) {
  return addToArray(
    router.error_handlers,
    error_handler_function,
  );
}
