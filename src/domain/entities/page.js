import { getNameOfVariable } from "../repositories/utilities.js";
import Component from "./component.js";

/**
 * @typedef {object} PageProps
 * @property {string} name
 * @property {string} title
 * @property {Component | object} [placeholders]
 */

export default class Page {
  /**
   *
   * @param {PageProps} props
   */
  constructor({ name, title, placeholders }) {
    this.name = validateName(name);
    this.title = validateTitle(title);

    this.placeholders = placeholders;
  }
}

function validateName(name) {
  const message = `[name] provided to ${Page.name}: [${name}].`;

  if (typeof name !== "string") {
    throw new Error(`Invalid ${message}`);
  }

  if (name.length === 0) {
    throw new Error(`Invalid ${message}`);
  }

  return name;
}

function validateTitle(title) {
  const message = `[title] provided to ${Page.name}: [${title}].`;

  if (typeof title !== "string") {
    throw new Error(`Invalid ${message}`);
  }

  if (title.length === 0) {
    throw new Error(`Invalid ${message}`);
  }

  return title;
}
