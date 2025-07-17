import RouterModel from "./src/data/models/router.js";
import Router from "./src/domain/entities/router.js";

/**
 * @typedef {import("node:http").ClientRequest} HttpRequest
 */

/**
 * @typedef {import("node:http").ServerResponse<import("node:http").ClientRequest>} HttpResponse
 */

export default class RouterLib {
  create() {
    const router = new Router();
    return new RouterModel(router);
  }
}
