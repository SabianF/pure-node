import blankPage from "../../presentation/pages/blank.js";

/**
 *
 * @param {object} props
 * @param {import("../../data/repositories/rendering.js").default} props.rendering_repo
 */
export default function loadBlankPage({ rendering_repo }) {
  /**
   * @type {import("../entities/types.js").HttpRequestHandler}
   */
  const handler = async (request, response) => {
    const page = await rendering_repo.renderPage(blankPage());
    response.writeHtml(page);
  };

  return handler;
}
