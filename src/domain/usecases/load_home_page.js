import rootPage from "../../presentation/pages/root.js";

/**
 * @param {object} props
 * @param {import("../../data/repositories/rendering.js").default} props.rendering_repo
 */
export default function loadHomePage({ rendering_repo }) {
  /**
   *
   * @param {import("../../data/repositories/routing_repo.js").HttpRequest} request
   * @param {import("../../data/repositories/routing_repo.js").HttpResponse} response
   */
  const handler = async (request, response) => {
    const page = await rendering_repo.renderPage(
      rootPage(),
    );

    response.write(page);
  };

  return handler;
}
