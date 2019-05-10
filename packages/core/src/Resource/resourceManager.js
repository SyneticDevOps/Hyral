import Repository from './Repository';
import ChangeSet from './Change/ChangeSet';

/**
 * @typedef HyralresourceManager
 *
 * @type {Object}
 * @property {function} createRepository
 * @property {function} addRepository
 * @property {function} getRepository
 * @property {function} getRepositories
 * @property {function} createChangeSet
 */

const repositories = {};

/**
 * @type {HyralresourceManager}
 */
const resourceManager = {};

Object.assign(resourceManager, {
  /**
   * @param {HyralConnector} connector
   * @param {String} resourceType
   * @param {String} identifier='id'
   *
   * @returns HyralRepository
   */
  createRepository(connector, resourceType, identifier = 'id') {
    const repository = Repository(connector, resourceType, identifier);

    resourceManager.addRepository(repository);

    return repository;
  },
  /**
   * @param {HyralRepository} resourceRepository
   */
  addRepository(resourceRepository) {
    if (typeof repositories[resourceRepository.resourceType] !== 'undefined') {
      throw Error(`Trying to add a repository for ${resourceRepository.resourceType} while there already exists a repository for that type.`);
    }
    repositories[resourceRepository.resourceType] = resourceRepository;
  },
  /**
   * @param resourceType
   *
   * @returns {HyralRepository|null}
   */
  getRepository(resourceType) {
    return repositories[resourceType] || null;
  },
  /**
   * @returns {HyralRepository[]}
   */
  getRepositories() {
    return repositories;
  },
  /**
   * @returns {HyralChangeSet}
   */
  createChangeSet() {
    return ChangeSet(resourceManager);
  },
});

export default resourceManager;