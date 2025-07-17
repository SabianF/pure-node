import mustache from "./packages/mustache/mustache.mjs";

export default class HtmlRenderingLib {
  /**
   *
   * @param {string} html_template
   * @param {object} html_placeholders
   * @returns {string}
   */
  render(html_template, html_placeholders) {
    return mustache.render(html_template, html_placeholders);
  }
}
