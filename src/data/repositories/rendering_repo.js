import Component from "../../domain/entities/component.js";
import Page from "../../domain/entities/page.js";
import { getNameOfVariable, loopThroughNested } from "../../domain/repositories/utilities.js";
import layout from "../../presentation/components/layout.js";
import FileSystemIo from "../sources/file_system_io.js";
import HtmlRenderer from "../sources/html_renderer.js";

const COMPONENTS_BASE_PATH = "src/presentation/components";
const PAGES_BASE_PATH = "src/presentation/pages";

export default class RenderingRepo {
  /**
   * @type {FileSystemIo}
   */
  file_system_io_library;

  /**
   * @type {HtmlRenderer}
   */
  html_renderer_library;

  /**
   *
   * @param {object} props
   * @param {FileSystemIo} props.file_system_io_library
   * @param {HtmlRenderer} props.html_renderer_library
   */
  constructor({
    file_system_io_library,
    html_renderer_library,
  }) {
    if (!file_system_io_library) {
      throw new Error(`No ${getNameOfVariable(file_system_io_library)} provided to ${RenderingRepo.name}.`)
    }
    this.file_system_io_library = file_system_io_library;

    if (!html_renderer_library) {
      throw new Error(`No ${getNameOfVariable(html_renderer_library)} provided to ${RenderingRepo.name}.`)
    }
    this.html_renderer_library = html_renderer_library;
  }

  /**
   *
   * @param {Page} page
   */
  async renderPage(page) {
    const {
      name,
      placeholders,
    } = page;

    const raw_page = await this.#getFileAsString(`${PAGES_BASE_PATH}/${name}.html`);
    const rendered_page = await this.html_renderer_library.render(raw_page, placeholders);
    const layout_component = layout({
      title: "Root Page",
      body: rendered_page,
    });
    const rendered_layout = await this.renderComponent(layout_component);
    return rendered_layout;
  }

  /**
   *
   * @param {Component} component
   */
  async renderComponent(component) {
    const rendered_component = await this.#buildComponentTree(component);
    return rendered_component;
  }

  async #getFileAsString(path) {
    const file_buffer = await this.file_system_io_library.readFile(path);
    const file_string = file_buffer.toString();
    return file_string;
  }

  /**
   *
   * @param {Component} component The component to render
   * @param {Component} [parent_component]
   * @param {string} [parent_placeholder_key]
   */
  async #buildComponentTree(
    component,
    parent_component,
    parent_placeholder_key,
  ) {
    for (const placeholder_key in component.placeholders) {
      if (Object.prototype.hasOwnProperty.call(component.placeholders, placeholder_key)) {
        /**
         * @type {Component}
         */
        const placeholder_value = component.placeholders[placeholder_key];
        const is_component = !!placeholder_value.placeholders;
        if (is_component) {
          // Search through the child component
          await this.#buildComponentTree(
            placeholder_value,
            component,
            placeholder_key,
          );
        }
      }
    }

    // If there are no components in the placeholders, and this is the bottom-level component
    const component_html = await this.#getFileAsString(`${COMPONENTS_BASE_PATH}/${component.name}.html`);
    const rendered_component = this.html_renderer_library.render(
      component_html,
      component.placeholders,
    );

    if (parent_component) {
      parent_component.placeholders[parent_placeholder_key] = rendered_component;
      return parent_component;
    }

    return rendered_component;
  }
}
