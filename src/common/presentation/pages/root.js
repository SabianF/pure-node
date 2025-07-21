import Page from "../../domain/entities/page.js";
import table from "../components/table.js";

/**
 * @typedef {import("../../domain/entities/component.js").default} Component
 */

export default function rootPage() {
  const table_component = table({
    id: "table_id_one",
    headers: ["One", "Two", "Three", "Four", "Five"],
    data_rows_and_columns: [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ],
  });

  return new Page({
    name: "root",
    title: "Pure Node Homepage",
    placeholders: {
      table: table_component,
    },
  });
}
