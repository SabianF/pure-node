import Handler from "../entities/handler.js";
import http_status_codes from "../../data/sources/http_status_codes.js";
import Result from "../entities/result.js";

/**
 * @typedef {import("../entities/types.js").ResponseModel} ResponseModel
 */

/**
 * @typedef {import("../entities/types.js").HttpRequest} HttpRequest
 */

export function validateExists(data) {
  const is_unset = (data === undefined);
  if (is_unset) {
    return false;
  }

  const is_null = (data === null);
  if (is_null) {
    return false;
  }

  const type = typeof data;
  switch (type) {
    case "boolean":
    case "function":
    case "number":
    case "object":
    case "string":
      return true;

    default:
      throw new Error(`Unexpected type: [${type}]`);
  }
}

export function validateHasData(data) {
  const exists = validateExists(data);
  if (!exists) {
    return false;
  }

  const type = typeof data;
  let class_name;
  switch (type) {
    case "boolean":
    case "number":
      return true;

    case "string":
      return data.length > 0;

    case "object":
      class_name = data.constructor.name;
      if (
        class_name !== "Array" &&
        class_name !== "Object"
      ) {
        break;
      }

      const keys = Object.keys(data);
      if (keys.length === 0) {
        return false;
      }
      for (const key of keys) {
        const val = data[key];
        if (validateExists(val)) {
          return true;
        }
      }
      return false;

    default:
      break;
  }

  throw new Error(`Unexpected type: [${type}][${class_name}]`);
}

/**
 *
 * @param {any[]} array
 * @param {any} item
 */
export function addToArray(array, item) {
  try {
    if (array === undefined || Array.isArray(array) === false) {
      throw new Error(`No array provided to ${addToArray.name}`);
    }

    if (!item) {
      throw new Error(`No valid item provided to ${addToArray.name}`);
    }

    if (array.includes(item)) {
      throw new Error(`Item already exists in array`);
    }

    const new_length_of_array = array.push(item);
    return new Result({
      data: new_length_of_array,
    });

  } catch (error) {
    return new Result({
      error: error,
    });
  }
}

/**
 *
 * @param {Handler[]} middleware
 * @param {HttpRequest} request
 * @param {ResponseModel} response_model
 */
export function executeMiddleware(middleware, request, response_model) {
  for (let i = 0; i < middleware.length; i++) {
    const middleware_item = middleware[i];
    middleware_item.handler_function(request, response_model);
  }
}

/**
 *
 * @param {string} url
 * @param {ResponseModel} response_model
 * @returns validated URL
 */
export function validateRequestUrl(url, response_model) {
  if (!url) {
    response_model.setStatus(getHttpStatusCodes().codes.BAD_REQUEST);
    response_model.writeHtml(`URL was not provided in Request: [${url}]`);
    return;
  }
  return url;
}

/**
 *
 * @param {string} method
 * @param {ResponseModel} response_model
 */
export function validateRequestMethod(method, response_model) {
  if (!method) {
    response_model.setStatus(getHttpStatusCodes().codes.BAD_REQUEST);
    response_model.writeHtml(`Request method was not provided: [${method}]`);
    return;
  }
  return method;
}

export function getHttpStatusCodes() {
  return http_status_codes;
}
