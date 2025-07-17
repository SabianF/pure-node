import Component from "../../domain/entities/component.js";

/**
 * @typedef TableProps
 * @property {string} [id]
 * @property {string[]} headers
 * @property {string[][]} data_rows_and_columns
 * @property {string[]} [footers]
 */

/**
 *
 * @param {TableProps} placeholders
 */
export default function table(placeholders) {
  return new Component({
    name: "table",
    placeholders: placeholders,
  })
}
