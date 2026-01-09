import { test, expect } from '@playwright/test';

test.describe('GET /items - Get All Items', () => {
  test('should return 200 status code', async ({ request }) => {
    const response = await request.get('/items');
    expect(response.status()).toBe(200);
  });

  test('should return JSON content type', async ({ request }) => {
    const response = await request.get('/items');
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return an array of items', async ({ request }) => {
    const response = await request.get('/items');
    const items = await response.json();

    expect(Array.isArray(items)).toBeTruthy();
    expect(items.length).toBeGreaterThan(0);
  });

  test('should return items with correct structure', async ({ request }) => {
    const response = await request.get('/items');
    const items = await response.json();

    if (items.length > 0) {
      const firstItem = items[0];

      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('description');
      expect(firstItem).toHaveProperty('price');
      expect(firstItem).toHaveProperty('quantity');

      expect(typeof firstItem.id).toBe('number');
      expect(typeof firstItem.name).toBe('string');
      expect(typeof firstItem.description).toBe('string');
      expect(typeof firstItem.price).toBe('number');
      expect(typeof firstItem.quantity).toBe('number');
    }
  });

  test('should validate item data types and values', async ({ request }) => {
    const response = await request.get('/items');
    const items = await response.json();

    items.forEach((item: any) => {
      expect(item.id).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.price).toBeGreaterThanOrEqual(0);
      expect(item.quantity).toBeGreaterThanOrEqual(0);
    });
  });

  test('should measure response time', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/items');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(1000);
  });
});
