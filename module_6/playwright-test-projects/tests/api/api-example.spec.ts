import { test, expect } from '@playwright/test';

/**
 * API Tests
 *
 * These tests run in the 'api' project only.
 * They test API endpoints without using a browser.
 * Base URL is set to: https://jsonplaceholder.typicode.com
 *
 * Run with: npm run test:api
 */

test.describe('API Testing - GET Requests', () => {
  test('should fetch posts', async ({ request }) => {
    // Make GET request to /posts endpoint
    const response = await request.get('/posts');

    // Verify response status
    expect(response.status()).toBe(200);

    // Parse JSON response
    const posts = await response.json();

    // Verify response structure
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);

    // Verify first post has expected properties
    expect(posts[0]).toHaveProperty('userId');
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
    expect(posts[0]).toHaveProperty('body');
  });

  test('should fetch a single post', async ({ request }) => {
    const postId = 1;
    const response = await request.get(`/posts/${postId}`);

    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post.id).toBe(postId);
    expect(post.title).toBeTruthy();
  });

  test('should fetch users', async ({ request }) => {
    const response = await request.get('/users');

    expect(response.status()).toBe(200);

    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');
  });
});

test.describe('API Testing - POST Requests', () => {
  test('should create a new post', async ({ request }) => {
    const newPost = {
      title: 'Test Post from Playwright',
      body: 'This is a test post created via API testing',
      userId: 1,
    };

    const response = await request.post('/posts', {
      data: newPost,
    });

    expect(response.status()).toBe(201);

    const createdPost = await response.json();
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    expect(createdPost.id).toBeTruthy();
  });
});

test.describe('API Testing - PUT Requests', () => {
  test('should update a post', async ({ request }) => {
    const postId = 1;
    const updatedPost = {
      id: postId,
      title: 'Updated Title',
      body: 'Updated body content',
      userId: 1,
    };

    const response = await request.put(`/posts/${postId}`, {
      data: updatedPost,
    });

    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post.title).toBe(updatedPost.title);
    expect(post.body).toBe(updatedPost.body);
  });
});

test.describe('API Testing - DELETE Requests', () => {
  test('should delete a post', async ({ request }) => {
    const postId = 1;
    const response = await request.delete(`/posts/${postId}`);

    expect(response.status()).toBe(200);
  });
});

test.describe('API Testing - Error Handling', () => {
  test('should handle 404 for non-existent resource', async ({ request }) => {
    const response = await request.get('/posts/99999');

    // JSONPlaceholder returns 404 for non-existent resources
    expect(response.status()).toBe(404);
  });

  test('should validate response headers', async ({ request }) => {
    const response = await request.get('/posts/1');

    expect(response.status()).toBe(200);

    // Check content-type header
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
  });
});
