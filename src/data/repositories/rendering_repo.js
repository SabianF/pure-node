import { getNameOfVariable } from "../../domain/repositories/utilities.js";
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
   * @param {string} name of HTML file in `presentation/components`
   * @param {object} placeholders
   */
  async renderComponent(name, placeholders) {
    const raw_component = await this.#getFileAsString(`${COMPONENTS_BASE_PATH}/${name}/.html`);
    return this.html_renderer_library.render(raw_component, placeholders);
  }

  async #getFileAsString(path) {
    const file_buffer = await this.file_system_io_library.readFile(path);
    const file_string = file_buffer.toString();
    return file_string;
  }
}
