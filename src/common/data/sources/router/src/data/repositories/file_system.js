/**
 * @typedef {object} FileSystemRepoProps
 * @property {FileSystemLib} fs_lib FileSystem library
 */

import { validateType } from "../../../../../../domain/repositories/utilities.js";
import FileSystemLib from "../sources/file_system_lib.js";

export default class FileSystemRepo {
  /**
   * @type {FileSystemLib}
   */
  fs_lib;

  /**
   *
   * @param {FileSystemRepoProps} props
   */
  constructor({
    fs_lib,
  }) {
    this.fs_lib = validateFsLib(fs_lib);
  }

  /**
   *
   * @param {string} path
   */
  sanitizePath(path) {
    return path.replace(/^(\.\.[\/\\])+/, "");
  }

  /**
   *
   * @param {string} path
   */
  checkPathExists(path) {
    return this.fs_lib.checkPathExists(path);
  }

  /**
   *
   * @param {string} path
   */
  normalizePath(path) {
    const normalized_path_str = path
      .replace(/((\\)|(\/\/))/, "/")
      .replace(/((\/)(?!.))/, "");

    return normalized_path_str;
  }

  /**
   *
   * @param {string} path
   */
  async readFile(path) {
    return this.fs_lib.readFile(path);
  }
}

/**
 *
 * @param {FileSystemLib} fs_lib
 */
function validateFsLib(fs_lib) {
  return validateType({ fs_lib }, FileSystemLib.name);
}
