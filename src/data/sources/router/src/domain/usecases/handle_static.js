
import FileSystemRepo from "../../data/repositories/file_system.js";
import Handler from "../entities/handler.js";
import { handleRequest } from "../repositories/utilities.js";

/**
 * @typedef CreateStaticHandlerProps
 * @property {FileSystemRepo} fs_repo
 * @property {string} path
 */

/**
 *
 * @param {CreateStaticHandlerProps} props
 */
export default function handleStatic({
  fs_repo,
  path,
}) {
  const sanitized_path = path.replace(/^(\.\.[\/\\])+/, '');

  if (fs_repo.checkPathExists(sanitized_path) === false) {
    throw new Error(`Invalid/nonexistent path provided to ${handleStatic.name}: [${path}]`);
  }

  console.log(`handleStatic: path exists: [${sanitized_path}]`);

  /**
   *
   * @type {handleRequest}
   */
  const handler_function = async (request, response) => {
    console.log(`handleStatic handler: ${sanitized_path}`);
  };

  return handler_function;
}
