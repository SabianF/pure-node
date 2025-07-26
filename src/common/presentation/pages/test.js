import Page from "../../domain/entities/page.js";

/**
 *
 * @param {object} placeholders
 */
export default function testPage(placeholders) {
  return new Page({
    name: "test",
    title: "Test Page",
    placeholders: placeholders,
  });
}
