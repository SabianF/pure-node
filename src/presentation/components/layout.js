import Component from "../../domain/entities/component.js";

/**
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string | Component} props.body
 * @param {string | Component} props.custom_header
 * @param {string | Component} props.custom_footer
 */
export default function layout(props) {
  return new Component({
    name: "layout",
    placeholders: props,
  });
}
