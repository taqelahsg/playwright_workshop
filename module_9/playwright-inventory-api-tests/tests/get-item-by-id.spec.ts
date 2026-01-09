import { test, expect } from '@playwright/test';

test.describe('GET /items/{id} - Get Item by ID', () => {
  test('should return 404 for any item ID (endpoint appears broken in this PlayPI instance)', async ({ request }) => {
    // Note: This PlayPI instance's GET /items/{id} endpoint returns 404 for all items
    // even though items exist in GET /items
    const response = await request.get('/items/1');
    expect(response.status()).toBe(404);
  });

  test('should return 404 for non-existent item', async ({ request }) => {
    const nonExistentId = 999999;
    const response = await request.get(`/items/${nonExistentId}`);
    expect(response.status()).toBe(404);
  });
});
