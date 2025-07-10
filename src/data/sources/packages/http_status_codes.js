import { ReasonPhrases } from "./http-status-codes/build/cjs/reason-phrases.js";
import { StatusCodes } from "./http-status-codes/build/cjs/status-codes.js";
import { getReasonPhrase, getStatusCode } from "./http-status-codes/build/cjs/utils-functions.js";

export default {
  codes: StatusCodes,
  reasons: ReasonPhrases,
  getCode: getStatusCode,
  getReason: getReasonPhrase,
}
