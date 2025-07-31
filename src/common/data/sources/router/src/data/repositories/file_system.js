import { validateType } from "../../../../../../domain/repositories/utilities.js";
import Result from "../../domain/entities/result.js";
import FileSystemLib from "../sources/file_system_lib.js";

/**
 * @typedef {object} FileSystemRepoProps
 * @property {FileSystemLib} fs_lib FileSystem library
 */

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
    try {
      const sanitized_path = path.replace(/^(\.\.[\/\\])+/, "");

      return new Result({
        data: sanitized_path,
      });

    } catch (error) {
      return new Result({
        error: error,
      });
    }
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
    try {
      const normalized_path_str = path
        .replace(/((\\)|(\/\/))/, "/")
        .replace(/((\/)(?!.))/, "");

      return new Result({
        data: normalized_path_str,
      });

    } catch (error) {
      return new Result({
        error: error,
      });
    }
  }

  /**
   *
   * @param {string} path
   */
  async readFileStats(path) {
    return this.fs_lib.readFileStats(path);
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
