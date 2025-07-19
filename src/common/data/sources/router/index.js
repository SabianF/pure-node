import DataRepos from "./src/data/repositories/repositories.js";
import DomainRepos from "./src/domain/repositories/repositories.js";
import createRouterModel from "./src/domain/usecases/create_router.js";

/**
 * @typedef {import("./src/data/models/router.js").default} Router
 */

const data_repos = new DataRepos();
const domain_repos = new DomainRepos({
  data_repos: data_repos,
});

export default class RouterLib {
  create() {
    return createRouterModel({
      routing_repo: domain_repos.routing_repo,
    });
  }
}
