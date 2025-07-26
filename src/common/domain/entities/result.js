/**
 * @typedef ResultProps
 * @property {any} [data]
 * @property {String} [error]
 */

import { validateExists } from "../repositories/utilities.js";

export default class Result {
  /**
   * @type {any}
   */
  data;

  /**
   * @type {Error}
   */
  error;

  /**
   * @type {Boolean}
   */
  has_error;

  /**
   *
   * @param {ResultProps} props
   */
  constructor({
    error,
    data,
  }) {
    if (validateExists(error)) {
      this.has_error = true;
      this.error = new Error(error);

    } else if (validateExists(data)) {
      this.has_error = false;
      this.data = data;

    } else {
      throw new Error(`No error or data provided to ${Result.name}. Must provide error or data.`);
    }
  }
}
