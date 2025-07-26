import old_fs, { promises as fs } from "node:fs";

export default class FileSystemLib {
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

  /**
   *
   * @param {String} path 
   */
  async readFileAsString(path) {
    const file_buffer = await fs.readFile(path);
    const file_string = file_buffer.toString();
    return file_string;
  }
}
