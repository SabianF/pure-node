import rootPage from "../../presentation/pages/root.js";

/**
 * @typedef {import("../entities/types.js").HttpRequestHandler} HttpRequestHandler
 */

/**
 * @param {object} props
 * @param {import("../../data/repositories/rendering.js").default} props.rendering_repo
 * @returns {HttpRequestHandler}
 */
export default function loadHomePage({ rendering_repo }) {
  return async (request, response) => {
    const page = await rendering_repo.renderPage(
      rootPage(),
    );

    response.writeHtml(page);
  }
}
