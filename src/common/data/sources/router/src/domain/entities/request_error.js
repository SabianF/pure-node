/**
 * @typedef {object} RequestErrorProps
 * @property {number} status_code
 * @property {string} message
 */

export default class RequestError extends Error {
  /**
   * @param {RequestErrorProps} props
   */
  constructor({
    status_code,
    message,
  }) {
    super(message);
    this.status_code = status_code;
  }
}
