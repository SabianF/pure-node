import { promises as fs } from "node:fs";

export default class FileSystemIo {
  async readFile(path) {
    return fs.readFile(path);
  }
}
