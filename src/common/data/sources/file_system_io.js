import old_fs, { promises as fs } from "node:fs";

export default class FileSystemIo {
  /**
   *
   * @param {string} path
   */
  checkPathExists(path) {
    return old_fs.existsSync(path);
  }

  async readFile(path) {
    return fs.readFile(path);
  }
}
