import { test, describe } from "node:test";
import assert from "node:assert";
import Component from "./component.js";

/**
 * @typedef {import("./component.js").ComponentProps} ComponentProps
 */

describe(Component.name, () => {
  describe("constructor", () => {
    test(`throws on missing/invalid props`, () => {
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

      for (const props of invalid_props) {
        assert.throws(() => {
          new Component(props);
        });
      }
    });

    test(`throws on missing/invalid name`, () => {
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

      for (const invalid_name of invalid_names) {
        assert.throws(() => {
          new Component({
            name: invalid_name,
          });
        }, `did not throw on value of [${invalid_name}]`);
      }
    });

    test(`returns ${Component.name} with appropriate props`, async () => {
      /**
       * @type {ComponentProps[]}
       */
      const valid_props = [
        {
          name: "layout",
        },
        {
          name: "layout",
          placeholders: {},
        },
        {
          name: "layout",
          placeholders: {
            title: "TEST TITLE",
          },
        },
        {
          name: "layout",
          placeholders: {
            title: "TEST TITLE",
            body: "TEST BODY",
          },
        },
      ];

      for (const props of valid_props) {
        const component = new Component(props);

        assert.strictEqual(component.constructor.name, Component.name);
        assert.strictEqual(component.name, props.name);
        assert.strictEqual(component.placeholders, props.placeholders);

        if (!props.placeholders) {
          continue;
        }
        assert.strictEqual(
          component.placeholders.title,
          props.placeholders.title,
        );

        if (!props.placeholders.body) {
          continue;
        }
        props.placeholders.body = new Component(props);
        const component_with_nested = new Component(props);
        assert.strictEqual(
          component_with_nested.placeholders.body,
          props.placeholders.body,
        );
      }
    });
  });
});
