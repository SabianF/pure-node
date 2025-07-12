import dotenv from "./packages/dotenv/lib/main.js";

export default class EnvLib {
  config(path) {
    const config = dotenv.config({
      path: path,
    });

    if (config.error) {
      throw new Error(config.error);
    }
  }
}
