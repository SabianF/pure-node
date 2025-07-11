import Component from "../entities/component.js";
import Page from "../entities/page.js";

export function getNameOfVariable(variable) {
  return Object.keys({ variable })[0];
}

/**
 *
 * @param {any} object
 * @param {loopThroughNestedHandler} handler
 * @param {string[]} [excluded_types]
 */
export async function loopThroughNested(object, handler, excluded_types) {
  if (typeof object !== "object") {
    throw new Error(
      `Invalid object provided to ${loopThroughNested.name}: [${object}]`,
    );
  }

  if (typeof handler !== "function") {
    throw new Error(
      `Invalid handler function provided to ${loopThroughNested.name}: [${handler}]`,
    );
  }

  for (const key in object) {
    const current_element = object[key];

    const isObject = typeof current_element === "object";

    if (isObject) {
      let isExcluded;
      if (!excluded_types) {
        isExcluded = false;
      } else {
        for (let i = 0; i < excluded_types.length; i++) {
          const excluded_type = excluded_types[i].toLowerCase();
          const current_type = current_element.constructor.name.toLowerCase();
          if (current_type === excluded_type) {
            isExcluded = true;
            break;
          }
        }
      }

      if (isExcluded) {
        await handler(current_element, key);
        continue;
      }

      if (Array.isArray(current_element)) {
        for (let i = 0; i < current_element.length; i++) {
          const nested_element = current_element[i];
          await loopThroughNested(nested_element, handler);
        }
      } /* If not array */ else {
        await loopThroughNested(current_element, handler);
      }
    } /* If not object */ else {
      await handler(current_element, key);
    }
  }
}

/**
 *
 * @param {*} nested_item_value
 * @param {string} nested_item_key
 */
async function loopThroughNestedHandler(nested_item_value, nested_item_key) {}
