import { promises as fs } from "node:fs";
import old_fs from "node:fs";
import path from "node:path";

export default class FileSystemLib {
  checkPathExists(path) {
    return old_fs.existsSync(path);
  }

  normalize(pathStr) {
    return path.normalize(pathStr);
  }

  async readFile(path) {
    return fs.readFile(path);
  }
}
