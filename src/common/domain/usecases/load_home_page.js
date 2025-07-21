import table from "../../presentation/components/table.js";
import rootPage from "../../presentation/pages/root.js";

/**
 * @param {object} props
 * @param {import("../../data/repositories/rendering.js").default} props.rendering_repo
 */
export default function loadHomePage({ rendering_repo }) {
  /**
   *
   * @param {import("../entities/types.js").HttpRequest} request
   * @param {import("../entities/types.js").HttpResponse} response
   */
  const handler = async (request, response) => {
    const rendered_table = await rendering_repo.renderComponent(
      table({
        id: "table_id_one",
        headers: ["One", "Two", "Three", "Four", "Five"],
        data_rows_and_columns: [
          [1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10],
          [11, 12, 13, 14, 15],
          [16, 17, 18, 19, 20],
          [21, 22, 23, 24, 25],
        ],
      }),
    );

    const page = await rendering_repo.renderPage(
      rootPage({
        table: rendered_table,
      }),
    );

    response.writeHtml(page);
  };

  return handler;
}
