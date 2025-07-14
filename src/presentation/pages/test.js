import Page from "../../domain/entities/page.js";

/**
 *
 * @param {object} props
 */
export default function testPage(props) {
  return new Page({
    name: "test",
    title: "Test Page",
    placeholders: props,
  })
}
