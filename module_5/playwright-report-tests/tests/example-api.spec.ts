import { test, expect } from '@playwright/test';

/**
 * API testing examples for demonstrating reporters
 * with different types of test results
 */

test.describe('API Testing Examples', () => {
  test('should make successful GET request', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
  });

  test('should make POST request', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Test Post',
        body: 'This is a test post body',
        userId: 1,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('Test Post');
  });

  test('should handle 404 error', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/999999');
    expect(response.status()).toBe(404);
  });

  test('should verify response headers', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const headers = response.headers();

    expect(headers['content-type']).toContain('application/json');
  });
});

test.describe('Multiple API Calls', () => {
  test('should fetch multiple resources', async ({ request }) => {
    // Fetch posts
    const postsResponse = await request.get('https://jsonplaceholder.typicode.com/posts');
    expect(postsResponse.ok()).toBeTruthy();
    const posts = await postsResponse.json();
    expect(Array.isArray(posts)).toBeTruthy();

    // Fetch users
    const usersResponse = await request.get('https://jsonplaceholder.typicode.com/users');
    expect(usersResponse.ok()).toBeTruthy();
    const users = await usersResponse.json();
    expect(Array.isArray(users)).toBeTruthy();

    // Fetch comments
    const commentsResponse = await request.get('https://jsonplaceholder.typicode.com/comments');
    expect(commentsResponse.ok()).toBeTruthy();
    const comments = await commentsResponse.json();
    expect(Array.isArray(comments)).toBeTruthy();
  });
});

test.describe('API Validation Tests', () => {
  test('should validate response schema', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
    expect(response.ok()).toBeTruthy();

    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('address');
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('city');
  });

  test('should validate array response', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts?userId=1');
    expect(response.ok()).toBeTruthy();

    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);

    // Validate first post structure
    expect(posts[0]).toHaveProperty('userId', 1);
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('body');
  });
});
