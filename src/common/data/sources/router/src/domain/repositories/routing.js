import FileSystemRepo from "../../data/repositories/file_system.js";
import HttpRepo from "../../data/repositories/http_repo.js";
import Router from "../entities/router.js";
import addMiddleware from "../usecases/add_middleware.js";
import addRequestHandler from "../usecases/add_request_handler.js";
import createServer from "../usecases/create_server.js";
import handleStatic from "../usecases/handle_static.js";
import startServer from "../usecases/start_server.js";

export default class RoutingRepo {
  /**
   * @type {FileSystemRepo}
   */
  #fs_repo;

  /**
   * @type {HttpRepo}
   */
  #http_repo;

  constructor({
    fs_repo,
    http_repo,
  }) {
    this.#fs_repo = fs_repo;
    this.#http_repo = http_repo;

    this.addMiddleware = addMiddleware;
    this.addRequestHandler = addRequestHandler;
    this.startServer = startServer;
  }

  handleStatic(base_path) {
    return handleStatic({
      fs_repo: this.#fs_repo,
      base_path,
    })
  }

  /**
   *
   * @param {Router} router
   */
  createServer(router) {
    const server = createServer(this.#http_repo, router);
    return server;
  }
}
