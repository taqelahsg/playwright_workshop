import { test, expect } from '@playwright/test';

/**
 * Permissions Emulation Examples
 * Demonstrates testing browser permissions
 */

test.describe('Permissions Emulation', () => {

  test('grant geolocation permission', async ({ browser }) => {
    const context = await browser.newContext({
      geolocation: { longitude: -122.4194, latitude: 37.7749 },
      permissions: ['geolocation'],
    });
    const page = await context.newPage();

    await page.goto('https://www.openstreetmap.org/');

    // Check if permission is granted
    const permissionState = await page.evaluate(async () => {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return result.state;
    });

    expect(permissionState).toBe('granted');
    console.log('Geolocation permission:', permissionState);

    await context.close();
  });

  test('grant notifications permission', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ['notifications'],
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Check notification permission
    const notificationPermission = await page.evaluate(() => {
      return Notification.permission;
    });

    expect(notificationPermission).toBe('granted');
    console.log('Notification permission:', notificationPermission);

    await context.close();
  });

  test('grant multiple permissions', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ['geolocation', 'notifications', 'clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Check multiple permissions
    const permissions = await page.evaluate(async () => {
      const geo = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      const notif = await navigator.permissions.query({ name: 'notifications' as PermissionName });

      return {
        geolocation: geo.state,
        notifications: notif.state,
        notificationAPI: Notification.permission,
      };
    });

    console.log('Permissions:', permissions);
    expect(permissions.geolocation).toBe('granted');
    expect(permissions.notificationAPI).toBe('granted');

    await context.close();
  });

  test('grant permission to specific domain', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Grant geolocation only to a specific origin
    await context.grantPermissions(['geolocation'], {
      origin: 'https://www.openstreetmap.org',
    });

    await page.goto('https://www.openstreetmap.org/');

    const osmPermission = await page.evaluate(async () => {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return result.state;
    });

    expect(osmPermission).toBe('granted');
    console.log('OpenStreetMap geolocation:', osmPermission);

    await context.close();
  });

  test('revoke permissions', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ['geolocation', 'notifications'],
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Initial check - permissions granted
    let notificationPermission = await page.evaluate(() => Notification.permission);
    expect(notificationPermission).toBe('granted');
    console.log('Initial notification permission:', notificationPermission);

    // Clear permissions
    await context.clearPermissions();

    // After clearing, permission should be default
    notificationPermission = await page.evaluate(() => Notification.permission);
    console.log('After clearing notification permission:', notificationPermission);

    await context.close();
  });

  test('clipboard permissions', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Write to clipboard
    await page.evaluate(async () => {
      await navigator.clipboard.writeText('Hello from Playwright!');
    });

    // Read from clipboard
    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    expect(clipboardText).toBe('Hello from Playwright!');
    console.log('Clipboard content:', clipboardText);

    await context.close();
  });

  test('test permission workflow', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://playwright.dev');

    // Initially no permissions
    await context.clearPermissions();

    // Grant geolocation
    await context.grantPermissions(['geolocation']);
    console.log('✓ Geolocation granted');

    // Grant notifications
    await context.grantPermissions(['notifications']);
    console.log('✓ Notifications granted');

    // Grant clipboard
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    console.log('✓ Clipboard granted');

    // Clear all
    await context.clearPermissions();
    console.log('✓ All permissions cleared');

    await context.close();
  });

  test('available permissions list', async ({ browser }) => {
    const permissions = [
      'geolocation',
      'notifications',
      'camera',
      'microphone',
      'clipboard-read',
      'clipboard-write',
    ];

    for (const permission of permissions) {
      const context = await browser.newContext({
        permissions: [permission],
      });
      const page = await context.newPage();

      await page.goto('https://playwright.dev');
      console.log(`✓ Testing permission: ${permission}`);

      await context.close();
    }
  });
});
