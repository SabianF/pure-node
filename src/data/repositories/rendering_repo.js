import Component from "../../domain/entities/component.js";
import Page from "../../domain/entities/page.js";
import { getNameOfVariable, loopThroughNested } from "../../domain/repositories/utilities.js";
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
   * @param {string} name of HTML file in `presentation/pages`
   * @param {object} placeholders
   */
  async renderPage(name, placeholders) {
    const raw_page = await this.#getFileAsString(`${PAGES_BASE_PATH}/${name}.html`);
    return this.html_renderer_library.render(raw_page, placeholders);
  }

  /**
   *
   * @param {Component} component
   */
  async renderComponent(component) {
    // DONE: Check all placeholders values for any components
    // DONE: If current placeholder is a component, check its placeholders for any components, recursively
    // TODO: At the bottom level when no placeholders are components, render the component normally
    // TODO: Insert the rendered component back into the parent component's placeholder, recursively
    const component_tree = [];
    this.#buildComponentTree(component, component_tree);
    console.log("component_tree");
    console.log(component_tree);
    const rendered_component = await this.#renderComponentTree(component_tree);
    return rendered_component;
  }

  async #getFileAsString(path) {
    const file_buffer = await this.file_system_io_library.readFile(path);
    const file_string = file_buffer.toString();
    return file_string;
  }

  /**
   *
   * @param {Component} component
   * @param {Component[]} list_to_store_component_tree
   */
  #buildComponentTree(component, list_to_store_component_tree) {
    for (const key in component.placeholders) {
      if (Object.prototype.hasOwnProperty.call(component.placeholders, key)) {
        const placeholder = component.placeholders[key];

        const is_component = !!placeholder.placeholders;
        if (is_component) {
          // Add this component to the tree
          list_to_store_component_tree.push(component);
          // Search through the child component's placeholders
          this.#buildComponentTree(placeholder, list_to_store_component_tree);
        }
      }
    }

    // If no placeholders are components, and we've reached bottom of component tree
    list_to_store_component_tree.push(component);
  }

  /**
   *
   * @param {Component[]} component_tree
   */
  async #renderComponentTree(component_tree) {
    let rendered_component = "";

    for (let i = component_tree.length - 1; i > 0; i--) {
      const component = component_tree[i];
      console.log(`${i}: ${component}`);
    }

    return rendered_component;
  }
}
