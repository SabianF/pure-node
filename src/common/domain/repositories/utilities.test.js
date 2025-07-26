import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validateExists, validateHasData } from "./utilities.js";

describe(`utilities`, () => {
  describe(`${validateExists.name}`, () => {
    test(`returns false on undefined or null`, async () => {
      const test_data = [
        undefined,
        null,
      ];

      for (const data of test_data) {
        const result = validateExists(data);
        assert.equal(result, false, `data [${data}]`);
      }
    });

    test(`returns true for "existing" datatypes`, async () => {
      const test_data = [
        false,
        true,
        0,
        2,
        "",
        [],
        {},
      ];

      for (const data in test_data) {
        const result = validateExists(data);
        assert.equal(result, true);
      }
    });
  });

  describe(`${validateHasData.name}`, () => {
    test(`returns false on nonexistent data`, async () => {
      const test_data = [
        undefined,
        null,
        [undefined],
        [null],
        { a_value: undefined },
        { a_value: null },
      ];

      for (const data of test_data) {
        const result = validateHasData(data);
        assert.equal(result, false, `data [${data}] was [${result}].`);
      }
    });

    test(`returns true on existing data`, async () => {
      const test_data = [
        false,
        true,
        0,
        2,
        " ",
        "undefined",
        "null",
        "false",
        "0",
        "[]",
        "{}",

        [false],
        [0],
        [""],
        [" "],
        ["undefined"],
        ["null"],
        ["false"],
        ["0"],
        ["[]"],
        ["{}"],

        { a_value: false },
        { a_value: 0 },
        { a_value: "" },
        { a_value: " " },
        { a_value: "undefined" },
        { a_value: "null" },
        { a_value: "false" },
        { a_value: "0" },
        { a_value: "[]" },
        { a_value: "{}" },
      ];

      for (const data of test_data) {
        const result = validateHasData(data);
        assert.equal(result, true, `data [${JSON.stringify(data)}] was [${result}].`);
      }
    });
  });
});
