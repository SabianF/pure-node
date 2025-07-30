import Handler from "../entities/handler.js";
import { addToArray } from "../repositories/utilities.js";

/**
 * @typedef {import("../entities/router.js").default} Router
 * @typedef {import("../entities/types.js").HttpRequestHandler} HttpRequestHandler
 *
 */

/**
 *
 * @param {object} props
 * @param {Router} props.router
 * @param {string} props.request_type
 * @param {string} props.url
 * @param {HttpRequestHandler} props.handler_function
 */
export default function addRequestHandler({ router, request_type, url, handler_function }) {
  const handler = new Handler({
    method: request_type,
    url: url,
    handler_function: handler_function,
  })

  return addToArray(router.request_handlers, handler);
}
