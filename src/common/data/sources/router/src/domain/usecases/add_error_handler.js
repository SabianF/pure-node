/**
 * @typedef {import("../entities/router.js").default} Router
 */

import { addToArray } from "../repositories/utilities.js";

/**
 * @typedef {import("../entities/types.js").ErrorHandlerFunction} ErrorHandlerFunction
 */

/**
 * @callback AddErrorHandlerFunction
 * @param {Object} props
 * @param {Router} props.router
 * @param {ErrorHandlerFunction} props.error_handler_function
 * @returns {number} Updated number of handlers
 */

/**
 * @type {AddErrorHandlerFunction}
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
