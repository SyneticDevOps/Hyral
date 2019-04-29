import Collection from '../../../Core/Resource/Collection';

export default function createVuexCollectionFromState(name, state, repository, store) {
  const collection = Collection.fromState(name, state, repository);

  const { load } = collection;
  collection.load = () => {
    load().then(() => {
      store.commit(`hyral_${this.repository.resourceType}/SET_COLLECTION`, {
        name: collection.name,
        state: collection.state,
      });

      collection.items.forEach((resource) => {
        store.commit(`hyral_${this.repository.resourceType}/SET_RESOURCE`, resource);
      });
    });
  };
}
