import Component from "./component.js";

/**
 * @typedef {object} PageProps
 * @property {string} name
 * @property {string} title
 * @property {Component | object} placeholders
 */

export default class Page {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  title;

  /**
   * @type {object}
   */
  placeholders;

  /**
   *
   * @param {PageProps} props
   */
  constructor({ name, title, placeholders }) {
    if (!name || typeof name !== "string") {
      throw new Error("No name string provided to Page.");
    }
    this.name = name;

    if (!title || typeof title !== "string") {
      console.warn("No title string provided to Page.");
    }
    this.title = title;

    this.placeholders = placeholders;
  }
}
