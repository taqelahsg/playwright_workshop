import { test, expect } from '@playwright/test';

test.describe('DELETE /items/{id} - Delete Item', () => {
  let testItemId: number;

  test.beforeEach(async ({ request }) => {
    const newItem = {
      name: 'Item to Delete',
      description: 'This item will be deleted in tests',
      price: 99.99,
      quantity: 5
    };

    const response = await request.post('/items', {
      data: newItem
    });

    const createdItem = await response.json();
    testItemId = createdItem.id;
  });

  test('should delete an existing item', async ({ request }) => {
    const response = await request.delete(`/items/${testItemId}`);
    expect(response.status()).toBe(200);
  });

  test('should return 200 OK with message on successful deletion', async ({ request }) => {
    const response = await request.delete(`/items/${testItemId}`);
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toBe('item deleted');
  });

  test('should verify item no longer exists after deletion', async ({ request }) => {
    await request.delete(`/items/${testItemId}`);

    const getResponse = await request.get(`/items/${testItemId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should return 404 when deleting non-existent item', async ({ request }) => {
    const nonExistentId = 999999;
    const response = await request.delete(`/items/${nonExistentId}`);
    expect(response.status()).toBe(404);
  });

  test('should return 404 when deleting already deleted item', async ({ request }) => {
    await request.delete(`/items/${testItemId}`);

    const secondDeleteResponse = await request.delete(`/items/${testItemId}`);
    expect(secondDeleteResponse.status()).toBe(404);
  });

  test('should not affect other items when deleting one item', async ({ request }) => {
    const anotherItem = {
      name: 'Another Item for Delete Test',
      description: 'Should not be affected',
      price: 149.99,
      quantity: 10
    };

    const createResponse = await request.post('/items', {
      data: anotherItem
    });
    const anotherItemId = (await createResponse.json()).id;

    await request.delete(`/items/${testItemId}`);

    // Since GET /items/{id} is broken, verify via GET /items
    const getAllResponse = await request.get('/items');
    const allItems = await getAllResponse.json();
    const foundItem = allItems.find((item: any) => item.id === anotherItemId);

    expect(foundItem).toBeDefined();
    expect(foundItem.name).toBe(anotherItem.name);
  });

  test('should handle deletion of item with zero quantity', async ({ request }) => {
    const zeroQuantityItem = {
      name: 'Zero Quantity Item',
      description: 'Item with no stock',
      price: 29.99,
      quantity: 0
    };

    const createResponse = await request.post('/items', {
      data: zeroQuantityItem
    });
    const itemId = (await createResponse.json()).id;

    const deleteResponse = await request.delete(`/items/${itemId}`);
    expect(deleteResponse.status()).toBe(200);

    const getResponse = await request.get(`/items/${itemId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should handle deletion of item with zero price', async ({ request }) => {
    const zeroPriceItem = {
      name: 'Free Item',
      description: 'Item with no cost',
      price: 0,
      quantity: 100
    };

    const createResponse = await request.post('/items', {
      data: zeroPriceItem
    });
    const itemId = (await createResponse.json()).id;

    const deleteResponse = await request.delete(`/items/${itemId}`);
    expect(deleteResponse.status()).toBe(200);
  });

  test('should measure deletion response time', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.delete(`/items/${testItemId}`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(500);
  });
});
