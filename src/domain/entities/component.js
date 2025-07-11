/**
 * @typedef {object} ComponentProps
 * @property {string} name
 * @property {Component | object} placeholders
 */

export default class Component {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {Component | object}
   */
  placeholders;

  /**
   *
   * @param {ComponentProps} props
   */
  constructor({ name, placeholders }) {
    if (!name || typeof name !== "string") {
      throw new Error("No name string provided to Component");
    }

    this.name = name;
    this.placeholders = placeholders;
  }
}
