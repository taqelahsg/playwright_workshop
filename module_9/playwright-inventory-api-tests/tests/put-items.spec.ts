import { test, expect } from '@playwright/test';

test.describe('PUT /items/{id} - Full Update Item', () => {
  let testItemId: number;

  test.beforeEach(async ({ request }) => {
    const newItem = {
      name: 'Original Item',
      description: 'Original description',
      price: 100.0,
      quantity: 10
    };

    const response = await request.post('/items', {
      data: newItem
    });

    const createdItem = await response.json();
    testItemId = createdItem.id;
  });

  test('should fully update an existing item', async ({ request }) => {
    const updatedData = {
      name: 'Updated Item Name',
      description: 'Updated description',
      price: 150.0,
      quantity: 20
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);

    const updatedItem = await response.json();
    expect(updatedItem.id).toBe(testItemId);
    expect(updatedItem.name).toBe(updatedData.name);
    expect(updatedItem.description).toBe(updatedData.description);
    expect(updatedItem.price).toBe(updatedData.price);
    expect(updatedItem.quantity).toBe(updatedData.quantity);
  });

  test('should return JSON content type', async ({ request }) => {
    const updatedData = {
      name: 'Test Update',
      description: 'Test description',
      price: 99.99,
      quantity: 5
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should update all fields at once', async ({ request }) => {
    const updatedData = {
      name: 'Completely New Name',
      description: 'Completely new description',
      price: 999.99,
      quantity: 100
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    expect(updatedItem.name).toBe(updatedData.name);
    expect(updatedItem.description).toBe(updatedData.description);
    expect(updatedItem.price).toBe(updatedData.price);
    expect(updatedItem.quantity).toBe(updatedData.quantity);
  });

  test('should update item with zero price', async ({ request }) => {
    const updatedData = {
      name: 'Free Item',
      description: 'No charge',
      price: 0,
      quantity: 50
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    expect(updatedItem.price).toBe(0);
  });

  test('should update item with zero quantity', async ({ request }) => {
    const updatedData = {
      name: 'Out of Stock',
      description: 'No items available',
      price: 49.99,
      quantity: 0
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    expect(updatedItem.quantity).toBe(0);
  });

  test('should preserve item ID after update', async ({ request }) => {
    const originalId = testItemId;

    const updatedData = {
      name: 'ID Preservation Test',
      description: 'Testing ID preservation',
      price: 75.0,
      quantity: 15
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    const updatedItem = await response.json();
    expect(updatedItem.id).toBe(originalId);
  });

  test('should update item with long description', async ({ request }) => {
    const longDesc = 'A'.repeat(200);
    const updatedData = {
      name: 'Long Description Item',
      description: longDesc,
      price: 199.99,
      quantity: 5
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    expect(updatedItem.description).toBe(longDesc);
  });
});
