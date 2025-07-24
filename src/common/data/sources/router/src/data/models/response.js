import { getHttpStatusCodes } from "../../domain/repositories/utilities.js";

/**
 * @typedef {import("../../domain/entities/types.js").HttpResponse} HttpResponse
 */

export default class ResponseModel {
  /**
   * @type {HttpResponse}
   */
  #response;

  /**
   * @type {any}
   */
  body;

  /**
   * @type {Headers}
   */
  headers;

  /**
   * @type {boolean}
   */
  was_handled;

  /**
   *
   * @param {HttpResponse} response
   */
  constructor(response) {
    this.#response = this.#validateResponse(response);
    this.headers = new Headers();
  }

  setStatus(code) {
    this.#response.statusCode = this.#validateStatusCode(code);
    this.#setHandled();
    return code;
  }

  hasHeader(name) {
    return this.#response.hasHeader(name);
  }

  getHeader(name) {
    return this.#response.getHeader(name);
  }

  setHeader(name, value) {
    this.#response.setHeader(name, value);
    return this;
  }

  setHeaders(headers) {
    this.#response.setHeaders(headers);
    return this;
  }

  /**
   *
   * @param {string | Buffer} html
   * @returns
   */
  writeHtml(html) {
    this.body = this.#validateHtml(html);
    this.headers.set("Content-Type", "text/html");
    return this;
  }

  /**
   *
   * @param {any} raw_data
   */
  writeRaw(raw_data) {
    this.body = this.#validateRawData(raw_data);
    return this;
  }

  /**
   * Sets the status code and writes to the response
   */
  send() {
    if (this.status_code) {
      this.#response.statusCode = this.status_code;
    }
    if (this.body) {
      this.#response.write(this.body);
    }

    this.#response.end();
    return this;
  }

  /**
   *
   * @param {HttpResponse} response
   * @returns {HttpResponse}
   */
  #validateResponse(response) {
    if (
      !response ||
      typeof response !== "object" ||
      response.constructor.name !== "ServerResponse"
    ) {
      throw new Error(`No/invalid response provided to ${ResponseModel.name}: [${response}].`);
    }

    return response;
  }

  #validateStatusCode(code) {
    if (
      !code ||
      typeof code !== "number" ||
      Object.values(getHttpStatusCodes().codes).includes(code) === false
    ) {
      throw new Error(`"Invalid status code provided to ${ResponseModel.name}.${this.setStatus.name}: [${code}].`);
    }

    return code;
  }

  /**
   *
   * @param {string | Buffer} html
   */
  #validateHtml(html) {
    if (!html) {
      throw new Error(`No HTML provided to ${ResponseModel.name}.${this.writeHtml.name}: [${html}].`);
    }
    if (
      typeof html !== "string" &&
      typeof html !== "object" &&
      html.constructor.name !== "Buffer"
    ) {
      throw new Error(`Invalid HTML provided to ${ResponseModel.name}.${this.writeHtml.name}: [${html}].`);
    }

    return html;
  }

  #validateRawData(raw_data) {
    if (!raw_data) {
      throw new Error(`No data provided to ${ResponseModel.name}.${this.writeRaw.name}.`);
    }

    return raw_data;
  }

  #setHandled() {
    this.was_handled = true;
  }
}
