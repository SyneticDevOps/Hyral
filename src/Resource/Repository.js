import ParameterBag from './ParameterBag';

export default {
  /**
   * @param {ParameterBag} parameterBag
   *
   * @returns {Promise<HyralResource[]>}
   */
  find(parameterBag) {
    return this.connector.fetch(this, parameterBag)
      .then(response => response.data);
  },

  /**
   * @param {ParameterBag} parameterBag
   *
   * @returns {Promise<HyralResource>}
   */
  findOne(parameterBag) {
    return this.find(parameterBag).then(data => data[0] || null);
  },

  /**
   * @param {String|Number} id
   *
   * @returns {Promise<HyralResource>}
   */
  findById(id) {
    return this.connector.fetchOne(this, id, new ParameterBag());
  },

  /**
   * @param {Object} entity
   *
   * @returns {Promise<HyralResource>}
   */
  create(entity) {
    return this.connector.create(this, entity);
  },

  /**
   * @param {Object} entity
   *
   * @returns {Promise<HyralResource>}
   */
  update(entity) {
    return this.connector.create(this, entity);
  },

  /**
   * @param {Object} entity
   *
   * @returns {Promise<Object>}
   */
  delete(entity) {
    return this.connector.create(this, entity);
  },
};
