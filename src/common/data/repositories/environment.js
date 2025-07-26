import Result from "../../domain/entities/result.js";
import { validateType } from "../../domain/repositories/utilities.js";
import EnvLib from "../sources/env_lib.js";

/**
 * @typedef EnvRepoProps
 * @property {EnvLib} env_lib
 */

export default class EnvRepo {
  /**
   * @type {EnvLib}
   */
  #env_lib;

  constructor({
    env_lib,
  }) {
    this.#env_lib = validateType({ env_lib }, EnvLib.name);
  }

  initEnv() {
    try {
      this.#env_lib.config();
      _validateEnv();
      return new Result({
        data: true,
      })

    } catch (error) {
      return new Result({
        error: error,
      });
    }
  }
}

function _validateEnv() {
  if (!process.env.PORT) {
    throw new Error("PORT environment variable is not set.");
  }
}
