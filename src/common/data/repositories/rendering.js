import Component from "../../domain/entities/component.js";
import Page from "../../domain/entities/page.js";
import Result from "../../domain/entities/result.js";
import { getNameOfVariable } from "../../domain/repositories/utilities.js";
import layout from "../../presentation/components/layout.js";
import FileSystemLib from "../sources/file_system_lib.js";
import HtmlRenderingLib from "../sources/html_rendering_lib.js";

/**
 * @typedef {import("../../domain/entities/types.js").ComponentString} ComponentString
 */

/**
 * @typedef {object} RenderingRepoConfig
 * @property {string[]} components_dirs
 */

/**
 * @typedef {object} RenderingRepoProps
 * @property {FileSystemLib} file_system_io_library
 * @property {HtmlRenderingLib} html_renderer_library
 * @property {RenderingRepoConfig} config
 */

export default class RenderingRepo {
  /**
   * @type {FileSystemLib}
   */
  #file_system_io_library;

  /**
   * @type {HtmlRenderingLib}
   */
  #html_renderer_library;

  /**
   * @type {RenderingRepoConfig}
   */
  #config;

  /**
   *
   * @param {RenderingRepoProps} props
   */
  constructor({ file_system_io_library, html_renderer_library, config }) {
    this.#file_system_io_library = validateFileSystemIoLib(
      file_system_io_library,
    );
    this.#html_renderer_library = validateHtmlRendererLib(
      html_renderer_library,
    );
    this.#config = validateConfig(config);
  }

  /**
   *
   * @param {Page} page
   */
  async renderPage(page) {
    const layout_component = layout({
      title: page.title,
      body: page,
    });
    try {
      const rendered_layout = await this.#renderNestedComponents(layout_component);
      return new Result({
        data: rendered_layout,
      });

    } catch (error) {
      return new Result({
        error: error,
      });
    }
  }

  /**
   *
   * @param {Component} component
   */
  async renderComponent(component) {
    try {
      const rendered_component = await this.#renderNestedComponents(component);
      return new Result({
        data: rendered_component,
      });

    } catch (error) {
      return new Result({
        error: error,
      });
    }
  }

  async #getFileAsString(path) {
    const file_buffer = await this.#file_system_io_library.readFile(path);
    const file_string = file_buffer.toString();
    return file_string;
  }

  /**
   *
   * @param {Component} component The component to render
   * @param {Component} [parent_component]
   * @param {string} [parent_placeholder_key]
   * @returns {Promise<string>}
   */
  async #renderNestedComponents(
    component,
    parent_component,
    parent_placeholder_key,
  ) {
    for (const placeholder_key in component.placeholders) {
      if (
        Object.prototype.hasOwnProperty.call(
          component.placeholders,
          placeholder_key,
        )
      ) {
        /**
         * @type {Component}
         */
        const placeholder_value = component.placeholders[placeholder_key];
        const is_component = checkIsComponent(placeholder_value);
        if (is_component) {
          // Search through the child component
          await this.#renderNestedComponents(
            placeholder_value,
            component,
            placeholder_key,
          );
        }
      }
    }

    // If there are no components in the placeholders, and this is the bottom-level component
    const component_parts = await this.#getComponentAsStringIfExists(component);
    const rendered_component_html = this.#html_renderer_library.render(
      component_parts.html,
      component.placeholders,
    );
    const rendered_component_css = this.#html_renderer_library.render(
      component_parts.css,
      component.placeholders,
    );
    const rendered_component_js = this.#html_renderer_library.render(
      component_parts.js,
      component.placeholders,
    );
    const rendered_component_full = (
      rendered_component_css +
      rendered_component_html +
      rendered_component_js
    );

    if (parent_component) {
      parent_component.placeholders[parent_placeholder_key] =
        rendered_component_full;
      return parent_component;
    }

    return rendered_component_full;
  }

  /**
   *
   * @param {Component} component
   */
  async #renderCss(component, css_path) {
    let path;
    if (css_path) {
      path = css_path;
    } else {
      path = `${this.#config.components_dirs}/${component.name}.css`;
    }

    if (this.#file_system_io_library.checkPathExists(path) === false) {
      return "";
    }

    const css = await this.#getFileAsString(path);
    const rendered_css = `<style id="${component.name}_css">${css}</style>`;

    return rendered_css;
  }

  /**
   *
   * @param {Component} component
   */
  async #renderJs(component, js_path) {
    let path;
    if (js_path) {
      path = js_path;
    } else {
      path = `${this.#config.components_dirs}/${component.name}_client.js`;
    }

    if (this.#file_system_io_library.checkPathExists(path) === false) {
      return "";
    }

    const js = await this.#getFileAsString(path);
    const rendered_js = `<script id="${component.name}_js">${js}</script>`;

    return rendered_js;
  }

  /**
   * @param {Component | Page} component
   * @throws if not found
   */
  async #getComponentAsStringIfExists(component) {
    for (const dir of this.#config.components_dirs) {
      const html_path = `${dir}/${component.name}.html`;
      const css_path = `${dir}/${component.name}.css`;
      const js_path = `${dir}/${component.name}_client.js`;

      if (this.#file_system_io_library.checkPathExists(html_path)) {
        /**
         * @type {ComponentString}
         */
        const result = {};
        result.html = await this.#getFileAsString(html_path);
        result.css = await this.#renderCss(component, css_path);
        result.js = await this.#renderJs(component, js_path);
        return result;
      }
    }

    throw new Error(`Component/Page [${component.name}] not found.`);

  }
}

function validateFileSystemIoLib(file_system_io_library) {
  if (!file_system_io_library) {
    throw new Error(
      `No ${getNameOfVariable({ file_system_io_library })} provided to ${RenderingRepo.name
      }.`,
    );
  }
  return file_system_io_library;
}

function validateHtmlRendererLib(html_renderer_library) {
  if (!html_renderer_library) {
    throw new Error(
      `No ${getNameOfVariable({ html_renderer_library })} provided to ${RenderingRepo.name
      }.`,
    );
  }
  return html_renderer_library;
}

/**
 *
 * @param {RenderingRepoConfig} config
 */
function validateConfig(config) {
  if (!config) {
    throw new Error(
      `No ${getNameOfVariable({ config })} provided to ${RenderingRepo.name}.`,
    );
  }

  const { components_dirs } = config;

  if (!components_dirs) {
    throw new Error(
      `No ${getNameOfVariable({ components_dirs })} provided to ${RenderingRepo.name
      }.`,
    );
  }

  return config;
}

/**
 *
 * @param {Component | Page} component
 */
function checkIsComponent(component) {
  return (
    !!component &&
    typeof component === "object" &&
    (
      component.constructor.name === Component.name ||
      component.constructor.name === Page.name
    )
  );
}
