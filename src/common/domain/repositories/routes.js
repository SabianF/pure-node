import loadBlankPage from "../usecases/lload_blank_page.js";
import loadHomePage from "../usecases/load_home_page.js";
import loadTestPage from "../usecases/load_test_page.js";

export default class RoutesRepo {
  /**
   *
   * @param {DataRepos} data_repos
   * @param {Router} router
   */
  addPublicRoutes(data_repos, router) {
    router.get("/", loadHomePage({
      rendering_repo: data_repos.rendering,
    }));

    router.get("/test", loadTestPage({
      rendering_repo: data_repos.rendering,
    }));

    router.get("/blank", loadBlankPage({
      rendering_repo: data_repos.rendering,
    }));
  }
}
