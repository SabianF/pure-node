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
   * @param {object} props
   * @param {string} props.name
   * @param {Component | object} props.placeholders
   */
  constructor({ name, placeholders }) {
    if (!name || typeof name !== "string") {
      throw new Error("No name string provided to Component");
    }

    this.name = name;
    this.placeholders = placeholders;
  }
}
