/**
 * @typedef {import("../entities/router.js").default} Router
 */

/**
 * @callback AddErrorHandlerFunction
 * @param {object} props
 * @param {Router} props.router
 * @param {import("../entities/types.js").ErrorHandlerFunction} props.error_handler_function
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
