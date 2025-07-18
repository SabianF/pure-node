import FileSystemLib from "../sources/file_system_lib.js";
import HttpLib from "../sources/http_lib.js";
import FileSystemRepo from "./file_system.js";
import HttpRepo from "./http_repo.js";

export default class DataRepos {
  constructor() {
    this.http_repo = _initHttpRepo();
    this.fs_repo = _initFsRepo();
  }
}


function _initHttpRepo() {
  const http_lib = new HttpLib();
  const http_repo = new HttpRepo({
    http_lib,
  });

  return http_repo;
}

function _initFsRepo() {
  const fs_lib = new FileSystemLib();
  const fs_repo = new FileSystemRepo({
    fs_lib,
  });

  return fs_repo;
}
