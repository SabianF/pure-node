import RouterModel from "../../data/models/router.js";
import Router from "../entities/router.js";

export default function createRouter() {
  const router = new Router();
  return new RouterModel(router);
}
