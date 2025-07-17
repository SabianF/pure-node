import { promises as fs } from "node:fs";
import old_fs from "node:fs";
export default class FileSystemLib {
  checkPathExists(path) {
    return old_fs.existsSync(path);
  }

  async readFile(path) {
    return fs.readFile(path);
  }
}
