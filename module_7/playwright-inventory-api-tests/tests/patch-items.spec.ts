import { test, expect } from '@playwright/test';

test.describe('PATCH /items/{id} - Partial Update Item', () => {
  let testItemId: number;
  const originalItemData = {
    name: 'Original Patch Item',
    description: 'Original description for patch',
    price: 100.0,
    quantity: 10
  };

  test.beforeEach(async ({ request }) => {
    const response = await request.post('/items', {
      data: originalItemData
    });

    const createdItem = await response.json();
    testItemId = createdItem.id;
  });

  test('should partially update only the name', async ({ request }) => {
    const patchData = {
      name: 'Updated Name Only'
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.status()).toBe(200);

    const updatedItem = await response.json();
    expect(updatedItem.name).toBe(patchData.name);
    expect(updatedItem.description).toBe(originalItemData.description);
    expect(updatedItem.price).toBe(originalItemData.price);
    expect(updatedItem.quantity).toBe(originalItemData.quantity);
  });

  test('should partially update only the price', async ({ request }) => {
    const patchData = {
      price: 199.99
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.status()).toBe(200);

    const updatedItem = await response.json();
    expect(updatedItem.price).toBe(patchData.price);
    expect(updatedItem.name).toBe(originalItemData.name);
    expect(updatedItem.description).toBe(originalItemData.description);
    expect(updatedItem.quantity).toBe(originalItemData.quantity);
  });

  test('should partially update only the quantity', async ({ request }) => {
    const patchData = {
      quantity: 50
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.status()).toBe(200);

    const updatedItem = await response.json();
    expect(updatedItem.quantity).toBe(patchData.quantity);
    expect(updatedItem.name).toBe(originalItemData.name);
    expect(updatedItem.description).toBe(originalItemData.description);
    expect(updatedItem.price).toBe(originalItemData.price);
  });

  test('should partially update only the description', async ({ request }) => {
    const patchData = {
      description: 'Updated description only'
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.status()).toBe(200);

    const updatedItem = await response.json();
    expect(updatedItem.description).toBe(patchData.description);
    expect(updatedItem.name).toBe(originalItemData.name);
    expect(updatedItem.price).toBe(originalItemData.price);
    expect(updatedItem.quantity).toBe(originalItemData.quantity);
  });

  test('should update multiple fields but not all', async ({ request }) => {
    const patchData = {
      price: 249.99,
      quantity: 25
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.status()).toBe(200);

    const updatedItem = await response.json();
    expect(updatedItem.price).toBe(patchData.price);
    expect(updatedItem.quantity).toBe(patchData.quantity);
    expect(updatedItem.name).toBe(originalItemData.name);
    expect(updatedItem.description).toBe(originalItemData.description);
  });

  test('should return JSON content type', async ({ request }) => {
    const patchData = {
      quantity: 30
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return error for non-existent item', async ({ request }) => {
    const nonExistentId = 999999;
    const patchData = {
      quantity: 10
    };

    const response = await request.patch(`/items/${nonExistentId}`, {
      data: patchData
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error).toHaveProperty('error');
    expect(error.error).toBe('item not found');
  });

  test('should set quantity to zero', async ({ request }) => {
    const patchData = {
      quantity: 0
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    expect(updatedItem.quantity).toBe(0);
  });

  test('should preserve item ID after partial update', async ({ request }) => {
    const originalId = testItemId;

    const patchData = {
      name: 'ID Preservation Test'
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    const updatedItem = await response.json();
    expect(updatedItem.id).toBe(originalId);
  });
});
