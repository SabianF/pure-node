
import FileSystemRepo from "../../data/repositories/file_system.js";
import Handler from "../entities/handler.js";

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
  console.log("final_url");
  console.log(sanitized_path);

  if (fs_repo.checkPathExists(sanitized_path) === false) {
    console.log(`handleStatic: path doesn't exist: [${sanitized_path}]`);
    return;
  }

  console.log(`handleStatic: path exists: [${sanitized_path}]`);

  const handler_function = (request, response) => {
    console.log(`handleStatic: ${sanitized_path}`);
  };

  const handler = new Handler({
    is_middleware: true,
    handler_function: handler_function,
  });

  return handler;
}
