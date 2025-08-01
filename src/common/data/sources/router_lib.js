import pureRouter from "./pure-router/index.js";

export default class RouterLib {
  constructor() {
    this.createRouter = pureRouter.createRouter;
    this.createStaticHandler = pureRouter.createStaticHandler;
  }
}
