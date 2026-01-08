import { test, expect } from '@playwright/test';

/**
 * Geolocation Emulation Examples
 * Demonstrates testing location-based features
 */

test.describe('Geolocation Emulation', () => {

  test('set geolocation to San Francisco', async ({ browser }) => {
    const context = await browser.newContext({
      geolocation: { longitude: -122.4194, latitude: 37.7749 },
      permissions: ['geolocation'],
    });
    const page = await context.newPage();

    await page.goto('https://www.openstreetmap.org/');

    // Get current position
    const position = await page.evaluate(() => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        });
      });
    });

    console.log('Position:', position);
    expect(position).toMatchObject({
      latitude: 37.7749,
      longitude: -122.4194,
    });

    await context.close();
  });

  test('change geolocation during test', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ['geolocation'],
    });
    const page = await context.newPage();

    // Start in San Francisco
    await context.setGeolocation({
      longitude: -122.4194,
      latitude: 37.7749,
    });

    await page.goto('https://www.openstreetmap.org/');

    let position = await page.evaluate(() => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        });
      });
    });

    console.log('SF Position:', position);
    expect(position).toMatchObject({
      latitude: 37.7749,
      longitude: -122.4194,
    });

    // Move to New York
    await context.setGeolocation({
      longitude: -74.0060,
      latitude: 40.7128,
    });

    position = await page.evaluate(() => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        });
      });
    });

    console.log('NY Position:', position);
    expect(position).toMatchObject({
      latitude: 40.7128,
      longitude: -74.0060,
    });

    await context.close();
  });

  test('test multiple cities', async ({ browser }) => {
    const cities = [
      { name: 'San Francisco', longitude: -122.4194, latitude: 37.7749 },
      { name: 'New York', longitude: -74.0060, latitude: 40.7128 },
      { name: 'London', longitude: -0.1276, latitude: 51.5074 },
      { name: 'Tokyo', longitude: 139.6917, latitude: 35.6895 },
    ];

    for (const city of cities) {
      const context = await browser.newContext({
        geolocation: { longitude: city.longitude, latitude: city.latitude },
        permissions: ['geolocation'],
      });
      const page = await context.newPage();

      await page.goto('https://www.openstreetmap.org/');

      const position = await page.evaluate(() => {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          });
        });
      });

      console.log(`${city.name}:`, position);
      expect(position).toMatchObject({
        latitude: city.latitude,
        longitude: city.longitude,
      });

      await context.close();
    }
  });

  test('geolocation with accuracy', async ({ browser }) => {
    const context = await browser.newContext({
      geolocation: {
        longitude: -122.4194,
        latitude: 37.7749,
        accuracy: 100, // Accuracy in meters
      },
      permissions: ['geolocation'],
    });
    const page = await context.newPage();

    await page.goto('https://www.openstreetmap.org/');

    const position = await page.evaluate(() => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        });
      });
    });

    console.log('Position with accuracy:', position);
    expect(position).toHaveProperty('accuracy');

    await context.close();
  });
});
