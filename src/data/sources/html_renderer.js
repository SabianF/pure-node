import mustache from "mustache";

export default class HtmlRenderer {
  render(html_template, html_placeholders) {
    return mustache.render(html_template, html_placeholders);
  }
}
