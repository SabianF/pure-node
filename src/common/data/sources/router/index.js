import RouterModel from "./src/data/models/router.js";
import DataRepos from "./src/data/repositories/repositories.js";
import Router from "./src/domain/entities/router.js";
import DomainRepos from "./src/domain/repositories/repositories.js";

const data_repos = new DataRepos();
const domain_repos = new DomainRepos({
  data_repos: data_repos,
});

const createRouter = () => {
  return new RouterModel({
    routing_repo: domain_repos.routing_repo,
    router: new Router(),
  });
};

export default class RouterLib {
  create() {
    return createRouter();
  }
}
