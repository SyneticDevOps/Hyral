import concat from 'lodash/concat';

/**
 * @typedef HyralTask
 *
 * @type {Object}
 * @property {string} type - The type of task (create/update/delete/relation)
 * @property {object} payload - The payload for the task (the changed resource or the relation)
 * @property {object|null} context - The context. This is the resource on a relation task.
 * @property {array} related - All tasks on this entity.
 * @property {array} dependencies - Tasks that need to be executed and resolved before this task.
 * @property {boolean} resolved - If the task has been resolved.
 * @property {boolean} claimed - If the task has been claimed.
 * @property {function} execute
 */

/**
 * @param {string} type (create/update/delete/relation)
 * @param {HyralRepository} repository
 * @param {object} payload
 * @param {HyralResource|null} context
 *
 * @returns {HyralTask}
 */
export default function Task(type, repository, payload, context = null) {
  let resolved = false;

  let claimed = false;

  /**
   * @type {HyralTask[]}
   */
  let dependencies = [];

  /**
   * @type {HyralTask[]}
   */
  let related = [];

  let executionPromise = null;

  const task = {
    get type() {
      return type;
    },
    get payload() {
      return payload;
    },
    get context() {
      return context;
    },
    get claimed() {
      return claimed;
    },
    get resolved() {
      return resolved;
    },
    get related() {
      return related;
    },
    get dependencies() {
      return dependencies;
    },
    claim() {
      claimed = true;
    },
    addDependencies(newDependencies) {
      dependencies = concat(dependencies, newDependencies);
    },
    addRelated(newRelated) {
      related = concat(related, newRelated);
    },
  };

  return Object.assign(task, {
    /**
     * @returns {Promise}
     */
    execute() {
      if (executionPromise) {
        return executionPromise;
      }

      task.claim();

      executionPromise = new Promise(async (resolve, reject) => {
        if (dependencies.length > 0) {
          try {
            await Promise.all(
              dependencies.map(dependency => dependency.execute()),
            );
          } catch (error) {
            reject(error);
          }
        }

        repository[type](task).then((response) => {
          resolved = true;
          resolve(response);
        }).catch(reject);
      });

      return executionPromise;
    },
  });
}