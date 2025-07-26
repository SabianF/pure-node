import crypto from "node:crypto";

/**
 *
 * @param {object} object_containing_variable e.g. `{ a_variable }`
 * @returns {string} name of the variable
 */
export function getNameOfVariable(object_containing_variable) {
  return Object.keys(object_containing_variable)[0];
}

export function validateExists(data) {
  const is_unset = (data === undefined);
  if (is_unset) {
    return false;
  }

  const is_null = (data === null);
  if (is_null) {
    return false;
  }

  const type = typeof data;
  switch (type) {
    case "boolean":
    case "number":
    case "string":
    case "object":
      return true;

    default:
      throw new Error(`Unexpected type: [${type}]`);
  }
}

export function validateHasData(data) {
  const exists = validateExists(data);
  if (!exists) {
    return false;
  }

  const type = typeof data;
  let class_name;
  switch (type) {
    case "boolean":
    case "number":
      return true;

    case "string":
      return data.length > 0;

    case "object":
      class_name = data.constructor.name;
      if (
        class_name !== "Array" &&
        class_name !== "Object"
      ) {
        break;
      }

      const keys = Object.keys(data);
      if (keys.length === 0) {
        return false;
      }
      for (const key of keys) {
        const val = data[key];
        if (validateExists(val)) {
          return true;
        }
      }
      return false;

    default:
      break;
  }

  throw new Error(`Unexpected type: [${type}][${class_name}]`);
}

/**
 *
 * @param {object} obj Object containing the variable (e.g. `{ variable_name }`)
 * @param {string} type Class name of type (e.g. `RoutingRepo.name | "RoutingRepo"`)
 * @throws if object doesn't exist, isn't an object, or is not the provided type
 * @returns the validated object
 */
export function validateType(obj, type) {
  const obj_name = getStringFromVariable(obj);

  if (
    !type ||
    typeof type !== "string"
  ) {
    throw new Error(`No/invalid type provided to ${validateType.name}: [${type}]`);
  }

  if (
    !obj ||
    !obj[obj_name] ||
    typeof obj[obj_name] !== "object" ||
    obj[obj_name].constructor.name !== type
  ) {
    throw new Error(`No/invalid ${obj_name} provided to ${type}: [${obj}]`);
  }

  return obj[obj_name];
}

/**
 *
 * @param {object} obj Object containing the variable
 */
export function getStringFromVariable(obj) {
  return Object.keys(obj)[0];
}

export function createHash(obj) {
  if (!obj) {
    return "";
  }

  /**
   * @type {string}
   */
  let obj_string;
  if (typeof obj === "string") {
    obj_string = obj;
  } else {
    obj_string = JSON.stringify(obj);
  }

  const hash = crypto.createHash("md5").update(obj_string).digest("hex");

  return hash;
}

/**
 * Defaults to 1000ms
 * @param {number} [ms=1000] Milliseconds
 * @returns {Promise<void>}
 */
export async function pause(ms) {
  if (!ms) {
    ms = 1000;
  }
  if (typeof ms !== "number") {
    throw new Error(`Invalid ms provided to ${pause.name}: [${ms}].`);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
