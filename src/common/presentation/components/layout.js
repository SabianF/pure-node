import Component from "../../domain/entities/component.js";

/**
 *
 * @param {object} placeholders
 * @param {string} placeholders.title
 * @param {string | Component} placeholders.body
 * @param {string | Component} placeholders.custom_header
 * @param {string | Component} placeholders.custom_footer
 */
export default function layout(placeholders) {
  return new Component({
    name: "layout",
    placeholders: placeholders,
  });
}
