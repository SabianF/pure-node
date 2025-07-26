/**
 * @typedef ResultProps
 * @property {any} [data]
 * @property {Error|String} [error]
 */

import {
  getNameOfVariable,
  validateExists,
  validateHasData,
} from "../repositories/utilities.js";

export default class Result {
  /**
   * @type {Boolean}
   */
  has_error;

  /**
   * @type {any}
   */
  data;

  /**
   * @type {Error|String}
   */
  error;

  /**
   *
   * @param {ResultProps} props
   */
  constructor({ error, data }) {
    if (validateExists(error)) {
      this.has_error = true;
      this.error = this.#parseError(error);

    } else if (validateExists(data)) {
      this.has_error = false;
      this.data = data;

    } else {
      throw new Error(
        `No error or data provided to ${Result.name}. Must provide error or data.`,
      );
    }
  }

  /**
   *
   * @param {Error|String} error
   */
  #parseError(error) {
    switch (typeof error) {
      case "object":
        if (error.constructor.name === Error.name) {
          return error;
        }
        break;

      case "string":
        if (validateHasData(error)) {
          return new Error(error);
        }
        break;

      default:
        break;
    }

    throw new Error(
      `Invalid [${getNameOfVariable({ error })}] provided to ${
        Result.name
      }: [${error}]`,
    );
  }
}
