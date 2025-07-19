import http from "node:http";
import Handler from "../entities/handler.js";
import {
  validateRequestMethod,
  validateRequestUrl,
} from "./utilities.js";
import http_status_codes from "../../data/sources/http_status_codes.js";

/**
 * @typedef {import("../entities/types.js").ErrorHandlerFunction} ErrorHandlerFunction
 */
