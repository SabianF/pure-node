import blankPage from "../../presentation/pages/blank.js";

/**
 *
 * @param {object} props
 * @param {import("../../data/repositories/rendering.js").default} props.rendering_repo
 */
export default function loadBlankPage({ rendering_repo }) {
  /**
   *
   * @param {import("../../data/repositories/routing_repo.js").HttpRequest} request
   * @param {import("../../data/repositories/routing_repo.js").HttpResponse} response
   */
  const handler = async (request, response) => {
    const page = await rendering_repo.renderPage(blankPage());
    response.write(page);
  };

  return handler;
}
