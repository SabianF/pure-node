import http_status_codes from "../../data/sources/http_status_codes.js";

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
 * @typedef {import("../entities/types.js").HttpRequest} HttpRequest
 */

/**
 * @typedef {import("../entities/types.js").ResponseModel} ResponseModel
 */

/**
 * @typedef {import("../entities/types.js").HttpRequestHandler} HttpRequestHandler
 */

/**
 * @typedef {import("../entities/types.js").FileSystemRepo} FileSystemRepo
 */

/**
 * @typedef CreateStaticHandlerProps
 * @property {FileSystemRepo} fs_repo
 * @property {string} base_path
 */

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
   * @type {HttpRequestHandler}
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
      response.setStatus(http_status_codes.codes.NOT_FOUND);
      return;
    }

    const was_modified = await handleCaching(fs_repo, sanitized_file_path, request, response);
    if (!was_modified) {
      response.setStatus(http_status_codes.codes.NOT_MODIFIED);
      return;
    }

    const file_data = await fs_repo.readFile(sanitized_file_path);
    response.statusCode = http_status_codes.codes.OK;
    response.writeHtml(file_data);
  };

  return handler_function;
}

/**
 *
 * @param {FileSystemRepo} fs_repo
 * @param {string} sanitized_file_path
 * @param {HttpRequest} request
 * @param {ResponseModel} response_model
 */
async function handleCaching(fs_repo, sanitized_file_path, request, response_model) {
  const client_file_last_modified = request.headers["if-modified-since"];

  const file_stats = await fs_repo.readFileStats(sanitized_file_path);
  const file_last_modified = file_stats.mtime.toUTCString();

  response_model.setHeader("Cache-Control", "public, max-age=5, must-revalidate");
  response_model.setHeader("Last-Modified", file_last_modified);

  const was_modified = (
    !client_file_last_modified ||
    client_file_last_modified !== file_last_modified
  );

  return was_modified;
}
