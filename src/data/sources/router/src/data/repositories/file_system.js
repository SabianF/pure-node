/**
 * @typedef {object} FileSystemRepoProps
 * @property {FileSystemLib} fs_lib FileSystem library
 */

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
  checkPathExists(path) {
    return this.fs_lib.checkPathExists(path);
  }

  normalizePath(path) {
    return this.fs_lib.normalize(path);
  }
}

/**
 *
 * @param {FileSystemLib} fs_lib
 */
function validateFsLib(fs_lib) {
  if (
    !fs_lib ||
    typeof fs_lib !== "object" ||
    fs_lib.constructor.name !== FileSystemLib.name
  ) {
    throw new Error(`No/invalid fs_lib provided to ${FileSystemRepo.name}: [${fs_lib}]`);
  }

  return fs_lib;
}
