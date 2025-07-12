import FileSystemRepo from "../../data/repositories/file_system.js";

/**
 * @typedef StaticRepoProps
 * @property {FileSystemRepo} fs_repo
 */

export default class StaticRepo {
  /**
   * @type {FileSystemRepo}
   */
  fs_repo;

  /**
   *
   * @param {StaticRepoProps} props
   */
  constructor({
    fs_repo,
  }) {
    this.fs_repo = validateFsRepo(fs_repo);
  }
}

/**
 *
 * @param {FileSystemRepo} fs_repo 
 */
function validateFsRepo(fs_repo) {
  if (
    !fs_repo ||
    typeof fs_repo !== "object" ||
    fs_repo.constructor.name !== FileSystemRepo.name
  ) {
    throw new Error(`No/invalid fs_repo provided to ${StaticRepo.name}`);
  }

  return fs_repo;
}
