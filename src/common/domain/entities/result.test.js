import { test, describe } from "node:test";
import assert from "node:assert/strict";
import Result from "./result.js";

describe(`${Result.name}`, () => {
  describe(`constructor`, () => {
    test(`throws on invalid props`, async () => {
      /**
       * @type {import("./result.js").ResultProps}
       */
      const test_props = [
        undefined,
        null,
        {},
        {
          has_error: false,
        },
        {
          error: false,
        },
        {
          error: 0,
        },
        {
          error: [],
        },
        {
          error: {},
        },
        {
          error: new Error("Invalid error"),
        },
      ];
      for (const props in test_props) {
        assert.throws(() => {
          new Result(props);
        }, `props [${props}]`);
      }
    });

    test(`returns on valid props`, async () => {
      /**
       * @type {import("./result.js").ResultProps}
       */
      const test_props = [
        {
          data: "Test data",
        },
        {
          data: false,
        },
        {
          data: 0,
        },
        {
          data: "",
        },
        {
          data: [],
        },
        {
          data: {},
        },
        {
          error: "Test error",
        },
      ];

      for (let i = 0; i < test_props.length; i++) {
        const props = test_props[i];
        const result = new Result(props);

        const has_error = result.has_error;

        const data = result.data;
        if (data) {
          assert.equal(has_error, false);
          assert.equal(data, props.data);
        }

        const error = result.error;
        if (error) {
          assert.equal(has_error, true);
          assert.equal(error.message, props.error);
        }
      }
    });
  });
});
