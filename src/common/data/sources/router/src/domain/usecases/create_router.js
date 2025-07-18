import RouterModel from "../../data/models/router.js";
import Router from "../entities/router.js";

/**
 * @callback CreateRouterModelFunction
 * @param {object} props
 * @param {import("../entities/types.js").RoutingRepo} props.routing_repo
 */

export default function createRouterModel({ routing_repo }) {
  return new RouterModel({
    routing_repo: routing_repo,
    router: new Router(),
  });
}
