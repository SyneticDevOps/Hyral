import Collection from '../../src/Resource/Collection';
import Resource from '../../src/Resource/Resource';

describe('Collection tests', () => {
  const mockResponse = {
    data: [
      new Resource<any>('1', 'products', { title: 'Product 1' }),
      new Resource<any>('2', 'products', { title: 'Product 2' }),
    ],
  };

  const productRepository = {
    find: jest.fn(() => Promise.resolve(mockResponse.data)),
  };
  const collection = new Collection('product', productRepository as any);

  test('that the collection is initialized correctly', () => {
    expect(collection.name).toEqual('product');
    expect(collection.repository).toBe(productRepository);
    expect(collection.length).toBe(0);
    expect(collection.items).toHaveLength(0);
    expect(collection.data).toHaveLength(0);
  });

  test('that the collection correctly uses the repository to find items', () => collection.load().then(() => {
    expect(productRepository.find.mock.calls).toHaveLength(1);
    expect(collection.length).toEqual(2);
    expect(collection.items).toHaveLength(2);
    expect(collection.data).toHaveLength(2);
  }));
});