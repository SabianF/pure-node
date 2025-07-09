import Page from "../../domain/entities/page.js";

/**
 *
 * @param {object} props
 * @param {string} props.message
 */
export default function rootPage(props) {
  return new Page({
    name: "root",
    title: "Pure Node Homepage",
    placeholders: props,
  });
}
