import Page from "../../domain/entities/page.js";

/**
 * @typedef {import("../../domain/entities/component.js").default} Component
 */

/**
 *
 * @param {object} placeholders
 * @param {Component} placeholders.table
 */
export default function rootPage(placeholders) {
  return new Page({
    name: "root",
    title: "Pure Node Homepage",
    placeholders: placeholders,
  });
}
