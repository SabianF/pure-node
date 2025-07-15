import Page from "../../domain/entities/page.js";

/**
 *
 * @param {object} placeholders
 * @param {string} placeholders.message
 */
export default function rootPage(placeholders) {
  return new Page({
    name: "root",
    title: "Pure Node Homepage",
    placeholders: placeholders,
  });
}
