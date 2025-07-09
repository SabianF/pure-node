import { describe, test } from "node:test";
import { loopThroughNested } from "./utilities.js";
import assert from "node:assert";
import Component from "../entities/component.js";

describe("utilities", () => {
  describe(loopThroughNested.name, () => {
    const object_with_nested_values = {
      "name": "John",
      "age": 30,
      "address": {
        "street": "123 Main St",
      },
      "phoneNumbers": [
        {
          "type": "home",
          "number": "555-555-1234"
        },
      ]
    };

    test("accesses nested values correctly", async () => {
      const flattened_values_source = [
        "John",
        30,
        "123 Main St",
        "home",
        "555-555-1234",
      ];

      let flattened_values_output = [];

      const handler = (nested_item) => {
        flattened_values_output.push(nested_item);
      };

      await loopThroughNested(object_with_nested_values, handler);

      assert.deepStrictEqual(flattened_values_output, flattened_values_source);
    });

    test("assigns key correctly", async () => {
      await loopThroughNested(object_with_nested_values, (value, key) => {
        switch (value) {
          case "John":
            assert.strictEqual(key, "name");
            break;
          case 30:
            assert.strictEqual(key, "age");
            break;
          case "123 Main St":
            assert.strictEqual(key, "street");
            break;
          case "home":
            assert.strictEqual(key, "type");
            break;
          case "555-555-1234":
            assert.strictEqual(key, "number");
            break;
          default:
            throw new Error(`Invalid value: [${value}]`);
        }
      });
    });

    test(`excludes excluded_types`, async () => {
      const test_object = {
        str: "string",
        component: new Component({
          name: "layout",
          placeholders: {
            title: "title",
            body: "body",
          },
        }),
      };

      await loopThroughNested(
        test_object,
        (value, key) => {
          switch (value) {
            case "layout":
            case "title":
            case "body":
              assert.fail(`Nested value of Component was accessed: [${value}]`);

            default:
              break;
          }
        },
        [
          Component.name,
        ],
      );
    });
  });
});
