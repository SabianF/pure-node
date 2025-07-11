import Router from "../sources/router/index.js";

export default class RoutingRepo {
  /**
   * @type {Router} router
   */
  router_library;

  /**
   *
   * @param {object} props
   * @param {Router} props.router_library
   */
  constructor({router_library}) {
    if (!router_library) {
      throw new Error("No router_library provided to RoutingRepo");
    }

    this.router_library = router_library;
  }

  createRouter() {
    return new Router();
  }
}
