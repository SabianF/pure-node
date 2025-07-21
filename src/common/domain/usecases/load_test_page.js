import testPage from "../../presentation/pages/test.js";

/**
 *
 * @param {object} props
 * @param {import("../../data/repositories/rendering.js").default} props.rendering_repo
 */
export default function loadTestPage({ rendering_repo }) {
/**
 * @type {import("../entities/types.js").HttpRequestHandler}
 */
const handler = async (request, response) => {
  const page = await rendering_repo.renderPage(
    testPage(),
  );
  response.writeHtml(page);
}

return handler;
}
