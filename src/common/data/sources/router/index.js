import FileSystemLib from "../file_system_lib.js";
import RouterModel from "./src/data/models/router.js";
import FileSystemRepo from "./src/data/repositories/file_system.js";
import HttpRepo from "./src/data/repositories/http_repo.js";
import HttpLib from "./src/data/sources/http_lib.js";
import Router from "./src/domain/entities/router.js";
import RoutingRepo from "./src/domain/repositories/routing.js";

/**
 * @typedef {import("node:http").ClientRequest} HttpRequest
 */

/**
 * @typedef {import("node:http").ServerResponse<import("node:http").ClientRequest>} HttpResponse
 */

// TODO: Properly refactor for DI
const http_lib = HttpLib;
const http_repo = new HttpRepo({
  http_lib,
});

const fs_lib = new FileSystemLib();
const fs_repo = new FileSystemRepo({
  fs_lib,
});

const routing_repo = new RoutingRepo({
  http_repo,
  fs_repo,
});

const createRouter = () => {
  const router = new Router();
  return new RouterModel({
    routing_repo: routing_repo,
    router: router,
  });
};

export default class RouterLib {
  create() {
    return createRouter();
  }
}
