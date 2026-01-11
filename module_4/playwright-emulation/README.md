# Playwright Emulation Examples

This project demonstrates Playwright's comprehensive emulation capabilities for testing web applications across different devices, browsers, locales, and user preferences.

## Project Structure

```
playwright-emulation/
├── tests/
│   ├── device-emulation.spec.ts      # Device and viewport emulation
│   ├── geolocation.spec.ts           # Geolocation testing
│   ├── locale-timezone.spec.ts       # Internationalization testing
│   ├── color-scheme.spec.ts          # Dark/light mode and media features
│   ├── permissions.spec.ts           # Browser permissions
│   └── network-conditions.spec.ts    # Offline mode and network testing
├── playwright.config.ts              # Configuration with multiple projects
├── package.json
└── README.md
```

## Features Demonstrated

### 1. Device Emulation
- Testing on mobile devices (iPhone, Pixel)
- Tablet testing (iPad)
- Desktop browser emulation
- Responsive design testing across breakpoints
- High DPI (Retina) display testing
- Touch support emulation

### 2. Geolocation
- Setting geographic coordinates
- Changing location during tests
- Testing location-based features
- Multi-city testing

### 3. Locale and Timezone
- International date formatting
- Number formatting across locales
- Currency formatting
- Timezone testing
- Multi-language support

### 4. Color Scheme
- Dark mode testing
- Light mode testing
- Print media emulation
- Reduced motion preferences
- Forced colors (high contrast)

### 5. Permissions
- Geolocation permissions
- Notification permissions
- Clipboard access
- Camera and microphone
- Domain-specific permissions

### 6. Network Conditions
- Offline mode testing
- JavaScript disabled
- Slow network simulation
- Resource blocking
- PWA offline functionality

## Installation

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/device-emulation.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project="Desktop Chrome"

# Run tests in mobile browser
npx playwright test --project="Mobile Chrome"

# Run dark mode tests
npx playwright test --project="Desktop Chrome Dark Mode"

# Run tests with specific locale
npx playwright test --project="Desktop Chrome - German"
```

## Test Projects

The configuration includes multiple projects for different scenarios:

- **Desktop Chrome** - Standard desktop browser
- **Desktop Firefox** - Firefox desktop browser
- **Desktop Safari** - Safari desktop browser
- **Mobile Chrome** - Pixel 5 emulation
- **Mobile Safari** - iPhone 13 emulation
- **iPad** - iPad Pro emulation
- **Desktop Chrome Dark Mode** - Dark theme testing
- **Desktop Chrome - German** - German locale testing
- **Desktop Chrome - Japanese** - Japanese locale testing
- **Desktop Chrome - Reduced Motion** - Accessibility testing

## Running Specific Test Scenarios

### Device Testing
```bash
# Run only device emulation tests
npx playwright test tests/device-emulation.spec.ts

# Run on specific device
npx playwright test --project="Mobile Safari"
```

### Geolocation Testing
```bash
# Run geolocation tests
npx playwright test tests/geolocation.spec.ts
```

### Locale Testing
```bash
# Run locale and timezone tests
npx playwright test tests/locale-timezone.spec.ts

# Run with specific locale project
npx playwright test --project="Desktop Chrome - Japanese"
```

### Color Scheme Testing
```bash
# Run color scheme tests
npx playwright test tests/color-scheme.spec.ts

# Run dark mode project
npx playwright test --project="Desktop Chrome Dark Mode"
```

### Permissions Testing
```bash
# Run permissions tests
npx playwright test tests/permissions.spec.ts
```

### Network Testing
```bash
# Run network conditions tests
npx playwright test tests/network-conditions.spec.ts
```

## Viewing Test Results

```bash
# View HTML report
npx playwright show-report

# Run tests with UI mode
npx playwright test --ui

# Debug specific test
npx playwright test tests/device-emulation.spec.ts --debug
```

## Key Concepts

### Device Emulation
```typescript
// Use preset device
test.use({ ...devices['iPhone 13'] });

// Or configure manually
test.use({
  viewport: { width: 375, height: 667 },
  userAgent: 'Custom User Agent',
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
```

### Geolocation
```typescript
// Set at context level
const context = await browser.newContext({
  geolocation: { longitude: -122.4194, latitude: 37.7749 },
  permissions: ['geolocation'],
});

// Change during test
await context.setGeolocation({ longitude: -74.0060, latitude: 40.7128 });
```

### Locale and Timezone
```typescript
const context = await browser.newContext({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
});
```

### Color Scheme
```typescript
// Via context
const context = await browser.newContext({ colorScheme: 'dark' });

// Via page emulation
await page.emulateMedia({ colorScheme: 'dark' });
```

### Permissions
```typescript
// Grant permissions
await context.grantPermissions(['geolocation', 'notifications']);

// Domain-specific
await context.grantPermissions(['geolocation'], {
  origin: 'https://example.com',
});

// Clear permissions
await context.clearPermissions();
```

### Network Conditions
```typescript
// Offline mode
await context.setOffline(true);

// JavaScript disabled
const context = await browser.newContext({ javaScriptEnabled: false });
```

## Best Practices

1. **Test Multiple Devices**: Cover mobile, tablet, and desktop
2. **Test Internationalization**: Test with different locales and timezones
3. **Accessibility**: Test dark mode, reduced motion, and high contrast
4. **Progressive Enhancement**: Test with JavaScript disabled
5. **Offline Support**: Test PWA offline functionality
6. **Responsive Design**: Test at common breakpoints

## Resources

- [Playwright Emulation Documentation](https://playwright.dev/docs/emulation)
- [Device Descriptors](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json)
- [Locale Codes](https://www.techonthenet.com/js/language_tags.php)
- [Timezone Identifiers](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## Next Steps

1. Modify tests to work with your application
2. Add custom device configurations
3. Create visual regression tests with different themes
4. Test your application's internationalization
5. Validate accessibility features
6. Test offline functionality for PWAs

## License

MIT
