/**
 *
 * @param {object} object_containing_variable e.g. `{ a_variable }`
 * @returns {string} name of the variable
 */
export function getNameOfVariable(object_containing_variable) {
  return Object.keys(object_containing_variable)[0];
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
    throw new Error(`No/invalid ${obj_name} provided to ${type}: [${JSON.stringify(obj, " ", 2)}]`);
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
