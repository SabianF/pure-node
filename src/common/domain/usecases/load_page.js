import blankPage from "../../presentation/pages/blank.js";
import rootPage from "../../presentation/pages/root.js";
import testPage from "../../presentation/pages/test.js";

/**
 * @typedef {import("../entities/types.js").HttpRequestHandler} HttpRequestHandler
 */

/**
 * @param {string} name
 * @param {object} placeholders
 */
export default function loadPage(name, placeholders) {
  switch (name.toUpperCase()) {
    case "ROOT":
    case "HOME":
      return rootPage();

    case "BLANK":
      return blankPage();

    case "TEST":
      return testPage(placeholders);

    default:
      throw new Error(`Invalid Page provided to ${loadPage.name}: [${name}]`);

  }
}
