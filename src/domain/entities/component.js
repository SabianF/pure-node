/**
 * @typedef {object} ComponentProps
 * @property {string} name
 * @property {Component | object} placeholders
 */

/**
 * A representation of a UI element
 */
export default class Component {
  /**
   * @param {ComponentProps} props
   */
  constructor({ name, placeholders }) {
    this.name = validateName(name);
    this.placeholders = validatePlaceholders(placeholders);
  }
}

function validateName(name) {
  const message = `string for [name] provided to [${Component.name}].`;

  if (typeof name !== "string") {
    throw new Error(`Invalid ${message}`);
  }

  if (name.length === 0) {
    throw new Error(`Empty ${message}`);
  }

  return name;
}

function validatePlaceholders(placeholders) {


  return placeholders;
}
