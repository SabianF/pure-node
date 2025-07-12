import { validateType } from "../../domain/repositories/utilities.js";
import EnvLib from "../sources/process_env.js";

/**
 * @typedef EnvRepoProps
 * @property {EnvLib} env_lib
 */

export default class EnvRepo {
  /**
   * @type {EnvLib}
   */
  env_lib;

  constructor({
    env_lib,
  }) {
    this.env_lib = validateType(env_lib, EnvLib.name);
  }

  initEnv() {
    this.env_lib.config();
    validateEnv();
  }
}

function validateEnv() {
  if (!process.env.PORT) {
    throw new Error("PORT environment variable is not set.");
  }
}
