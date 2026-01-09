import { test, expect } from '@playwright/test';

test.describe('POST /items - Create New Item', () => {
  let createdItemId: number;

  test('should create a new item with valid data', async ({ request }) => {
    const newItem = {
      name: 'Test Laptop',
      description: 'High-end gaming laptop',
      price: 2499.99,
      quantity: 5
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);

    const createdItem = await response.json();
    createdItemId = createdItem.id;

    expect(createdItem).toHaveProperty('id');
    expect(createdItem.name).toBe(newItem.name);
    expect(createdItem.description).toBe(newItem.description);
    expect(createdItem.price).toBe(newItem.price);
    expect(createdItem.quantity).toBe(newItem.quantity);
  });

  test('should return JSON content type', async ({ request }) => {
    const newItem = {
      name: 'Test Mouse',
      description: 'Wireless mouse',
      price: 49.99,
      quantity: 20
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should create item with minimum required fields', async ({ request }) => {
    const newItem = {
      name: 'Basic Item',
      description: 'Simple description',
      price: 10.0,
      quantity: 1
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.id).toBeGreaterThan(0);
  });

  test('should handle decimal prices correctly', async ({ request }) => {
    const newItem = {
      name: 'Decimal Price Item',
      description: 'Item with decimal price',
      price: 99.99,
      quantity: 10
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.price).toBe(99.99);
  });

  test('should handle zero quantity', async ({ request }) => {
    const newItem = {
      name: 'Out of Stock Item',
      description: 'Currently unavailable',
      price: 199.99,
      quantity: 0
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.quantity).toBe(0);
  });

  test('should handle large quantities', async ({ request }) => {
    const newItem = {
      name: 'Bulk Item',
      description: 'Large quantity item',
      price: 5.99,
      quantity: 10000
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.quantity).toBe(10000);
  });

  test('should create item with special characters in name', async ({ request }) => {
    const newItem = {
      name: 'Item-Name & Special_Chars (Test)',
      description: 'Testing special characters: @#$%',
      price: 29.99,
      quantity: 5
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.name).toBe(newItem.name);
  });
});
