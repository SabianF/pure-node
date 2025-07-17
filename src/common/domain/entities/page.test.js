import { test, describe } from "node:test";
import assert from "node:assert";
import Page from "./page.js";

/**
 * @typedef {import("./page.js").PageProps} PageProps
 */

describe(Page.name, () => {
  describe("constructor", () => {
    /**
     * @type {PageProps[]}
     */
    const valid_props = [
      {
        name: "layout",
        title: "TEST TITLE",
      },
      {
        name: "layout",
        title: "TEST TITLE",
        placeholders: {},
      },
      {
        name: "layout",
        title: "TEST TITLE",
        placeholders: {
          value: "TEST TITLE",
        },
      },
    ];

    /**
     * @type {PageProps[]}
     */
    const valid_nested_props = [
      {
        name: "layout",
        placeholders: {
          title: "TEST TITLE",
          body: new Page({
            name: "layout",
            title: "TEST TITLE",
            placeholders: {
              title: "Lv2 TEST TITLE",
              body: "<h1>Lv2 test body</h1>",
            },
          }),
        },
      },
    ];

    const invalid_props = [
      undefined,
      null,
      false,
      true,
      "",
      "a",
      [],
      [1],
      {},
      { a: 1 },
    ];

    const invalid_names = [
      undefined,
      null,
      false,
      true,
      "",
      [],
      [1],
      {},
      { a: 1 },
    ];

    const invalid_titles = [
      undefined,
      null,
      false,
      true,
      "",
      [],
      [1],
      {},
      { a: 1 },
    ];

    test(`throws on missing/invalid props`, () => {
      for (const props of invalid_props) {
        assert.throws(() => {
          new Page(props);
        });
      }
    });

    test(`throws on missing/invalid name`, () => {
      for (const invalid_name of invalid_names) {
        assert.throws(() => {
          new Page({
            name: invalid_name,
          });
        }, `did not throw on value of [${invalid_name}]`);
      }
    });

    test(`throws on missing/invalid title`, () => {
      for (const invalid_title of invalid_titles) {
        const props = valid_props[0];
        props.title = invalid_title;

        assert.throws(() => {
          new Page(props);
        }, `did not throw on value of [${invalid_title}]`);
      }
    });
  });
});
