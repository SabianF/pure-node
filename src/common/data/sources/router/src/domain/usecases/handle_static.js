
import FileSystemRepo from "../../data/repositories/file_system.js";
import http_status_codes from "../../data/sources/http_status_codes.js";

/**
 * @typedef {import("../repositories/utilities.js").handleRequest} RequestHandlerFunction
 */

/**
 * @typedef CreateStaticHandlerProps
 * @property {FileSystemRepo} fs_repo
 * @property {string} base_path
 */

/**
 * "file_extension": "content_type_header"
 */
const accepted_file_exts = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
};

/**
 *
 * @param {CreateStaticHandlerProps} props
 */
export default function handleStatic({
  fs_repo,
  base_path,
}) {
  if (fs_repo.checkPathExists(base_path) === false) {
    throw new Error(`Invalid/nonexistent path provided to ${handleStatic.name}: [${base_path}]`);
  }

  const normalized_base_path = fs_repo.normalizePath(base_path);

  /**
   *
   * @type {RequestHandlerFunction}
   */
  const handler_function = async (request, response) => {
    const requested_path = request.url;
    const sanitized_file_path = fs_repo.sanitizePath(normalized_base_path + requested_path);

    let is_file = false;
    for (const file_ext in accepted_file_exts) {
      if (sanitized_file_path.endsWith(file_ext) === false) {
        continue;
      }

      const content_type = accepted_file_exts[file_ext];
      response.setHeader("Content-Type", content_type);
      is_file = true;
    }

    if (!is_file) {
      return;
    }

    if (fs_repo.checkPathExists(sanitized_file_path) === false) {
      response.statusCode = http_status_codes.codes.NOT_FOUND;
      return;
    }

    const file_data = await fs_repo.readFile(sanitized_file_path);

    response.statusCode = http_status_codes.codes.OK;
    response.write(file_data);
    response.end();
  };

  return handler_function;
}
