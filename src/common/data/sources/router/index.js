import FileSystemLib from "../file_system_lib.js";
import FileSystemRepo from "./src/data/repositories/file_system.js";
import HttpRepo from "./src/data/repositories/http_repo.js";
import HttpLib from "./src/data/sources/http_lib.js";
import createRouter from "./src/domain/usecases/create_router.js";

/**
 * @typedef {import("node:http").ClientRequest} HttpRequest
 */

/**
 * @typedef {import("node:http").ServerResponse<import("node:http").ClientRequest>} HttpResponse
 */

{
  // TODO: Properly refactor for DI
  const http_lib = HttpLib;
  const http_repo = new HttpRepo({
    http_lib,
  });

  const fs_lib = new FileSystemLib();
  const file_system_repo = new FileSystemRepo({
    fs_lib,
  });
}
export default class RouterLib {
  create() {
    return createRouter();
  }
}
