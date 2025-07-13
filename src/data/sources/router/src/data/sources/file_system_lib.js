import { promises as fs } from "node:fs";
import old_fs from "node:fs";
export default class FileSystemLib {
  checkPathExists(path) {
    return old_fs.existsSync(path);
  }

  /**
   *
   * @param {string} path_str
   */
  normalize(path_str) {
    const normalized_path_str = path_str
      .replace(/((\\)|(\/\/))/, "/")
      .replace(/((\/)(?!.))/, "");

    return normalized_path_str;
  }

  async readFile(path) {
    return fs.readFile(path);
  }
}
