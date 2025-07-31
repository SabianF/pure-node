import { validateExists } from "../repositories/utilities.js";

/**
 * @typedef ResultProps
 * @property {any} data
 * @property {Error | String} error
 */

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
  constructor({ data, error }) {
    if (validateExists(error)) {
      this.has_error = true;

      if (typeof error === "string") {
        this.error = new Error(error);

      } else if (error instanceof Error) {
        this.error = new Error(undefined, { cause: error });

      } else {
        this.error = new Error(JSON.stringify(error));
      }

    } else if (validateExists(data)) {
      this.has_error = false;
      this.data = data;

    } else {
      throw new Error(`No data or error was provided. Must provide 1.`);
    }
  }
}
