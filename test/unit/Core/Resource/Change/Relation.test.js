import Resource from '../../../../../src/Core/Resource/Resource';
import {
  getChangedResourceRelations,
  getAllRelatedResources,
} from '../../../../../src/Core/Resource/Change/Relation/Relation';
import { resourceHasChanged } from '../../../../../src/Core/Resource/Change/Inspection';

describe('Relation tests', () => {
  test('that relations are correctly returned', () => {
    const author = Resource(2, 'author', { name: 'A great author' });
    const publications = [
      Resource(3, 'publication', { year: 1900 }),
      Resource(4, 'publication', { year: 1901 }),
    ];
    const resource = Resource(1, 'book', {
      title: 'A great book',
      author,
      publications,
    }, {
      author: {
        resource: 'author',
        cardinality: 'many-to-one',
      },
      publications: {
        resource: 'publication',
        cardinality: 'one-to-many',
      },
      coverImage: {
        resource: 'image',
        cardinality: 'many-to-one',
      },
    });

    const relatedResources = getAllRelatedResources(resource);
    expect(relatedResources).toHaveLength(3);
    expect(relatedResources[0]).toBe(author);
    expect(relatedResources[1]).toBe(publications[0]);
    expect(relatedResources[2]).toBe(publications[1]);
  });

  test('that changes in relations are correctly detected', () => {
    const author = Resource(2, 'author', { name: 'A great author' });
    const publications = [
      Resource(3, 'publication', { year: 1900 }),
    ];
    const resource = Resource(1, 'book', {
      title: 'A great book',
      author,
      publications,
    }, {
      author: {
        resource: 'author',
        cardinality: 'many-to-one',
      },
      publications: {
        resource: 'publication',
        cardinality: 'one-to-many',
      },
      coverImage: {
        resource: 'image',
        cardinality: 'many-to-one',
      },
    });

    expect(resourceHasChanged(resource)).toBeFalsy();
    expect(getChangedResourceRelations(resource)).toHaveLength(0);

    resource.data = {
      title: 'A great book',
      author: Resource(4, 'author', { name: 'Another great author' }),
      publications: [Resource(5, 'publication', { year: 1901 })],
    };

    const changedRelations = getChangedResourceRelations(resource);

    expect(resourceHasChanged(resource)).toBeTruthy();
    expect(changedRelations).toHaveLength(2);
    expect(changedRelations).toEqual(['author', 'publications']);
  });

  test('that changes on a property of a relation are not registered as relation change', () => {
    const author = Resource(2, 'author', { name: 'A great author' });
    const resource = Resource(1, 'book', {
      title: 'A great book',
      author,
    }, {
      author: {
        resource: 'author',
        cardinality: 'many-to-one',
      },
    });

    author.data = {
      name: 'An even greated author',
    };

    const changedRelations = getChangedResourceRelations(resource);
    expect(changedRelations).toHaveLength(0);
  });
});