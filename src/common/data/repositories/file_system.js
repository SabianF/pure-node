/**
 * @typedef {import("../../domain/entities/types.js").FileSystemLib} FileSystemLib
 */

/**
 * @typedef {object} FileSystemRepoProps
 * @property {FileSystemLib} fs_lib
 */

export default class FileSystemRepo {
  /**
   * @type {FileSystemLib}
   */
  fs_lib;

  /**
   * @type {FileSystemRepoProps}
   */
  constructor({ fs_lib }) {
    this.fs_lib = fs_lib;
  }

  /**
   *
   * @param {string} path
   */
  checkPathExists(path) {
    return this.fs_lib.checkPathExists(path);
  }

  async readFile(path) {
    return this.fs_lib.readFile(path);
  }
}
