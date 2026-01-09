# Module 8: Locator Strategies & Test Assertions

**Duration:** 3-4 hours (Full coverage) | 25 minutes (Intensive workshop)
**Level:** Intermediate
**Prerequisites:** Completed Modules 2-6

> **Note:** In the intensive one-day workshop (9 AM - 2 PM), this module is covered in 25 minutes focusing on user-facing locators (role, text, label) and auto-retrying assertions.

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Understand how Playwright locators work and their auto-waiting behavior
- ✅ Use user-facing locators (role, text, label) effectively
- ✅ Apply locator best practices and prioritization
- ✅ Chain and filter locators for precise element targeting
- ✅ Work with lists and dynamic content
- ✅ Avoid brittle selectors (CSS, XPath)
- ✅ Master auto-retrying assertions for reliable testing
- ✅ Use appropriate assertion types for different scenarios
- ✅ Write accessible and resilient tests

---

## 📚 Topics Covered

### 1. Locator Strategies (120-150 minutes)
**File:** [01_locator_strategies.md](01_locator_strategies.md)

Learn about:
- How locators work in Playwright
- Auto-waiting and retry-ability
- Recommended locator types (priority order)
- Role locators (getByRole)
- Text locators (getByText)
- Label locators (getByLabel)
- Placeholder locators (getByPlaceholder)
- Alt text locators (getByAltText)
- Title locators (getByTitle)
- Test ID locators (getByTestId)
- CSS and XPath locators (when to avoid)

**Advanced features:**
- Chaining locators
- Filtering by text and child elements
- Combining locators (AND/OR)
- Working with lists
- Locator strictness
- Shadow DOM support

**Use cases:**
- Login forms
- Navigation elements
- Forms with multiple fields
- Dynamic content
- Product listings
- Shopping carts

**Hands-on Lab:**
- Explore: [playwright-locators/](playwright-locators/)
- Practice all locator types
- Implement chaining and filtering
- Work with dynamic lists

### 2. Test Assertions (90-120 minutes)
**File:** [02_test_assertions.md](02_test_assertions.md)

Learn about:
- Auto-retrying assertions and how they work
- Visibility and state assertions
- Content assertions (text, value, attributes)
- Form and input assertions
- Page and URL assertions
- Non-retrying assertions (Jest/Expect)
- Soft assertions for multiple validations
- Custom assertion messages
- Polling assertions
- Timeout configuration

**Advanced features:**
- Custom matchers
- Screenshot assertions
- Accessibility assertions
- API response validation
- Negating assertions with `.not`

**Use cases:**
- Form validation testing
- Loading state verification
- Dynamic content updates
- Navigation validation
- Multi-element verification

**Hands-on Lab:**
- Practice auto-retrying assertions
- Implement form validation tests
- Work with soft assertions
- Configure custom timeouts

---

## 🧪 Lab Exercises

### Lab 1: User-Facing Locators (30 minutes)

**Task:** Practice using role, text, and label locators

1. **Using Role Locators:**
```typescript
test('navigate using role locators', async ({ page }) => {
  await page.goto('https://example.com');

  // Click a button
  await page.getByRole('button', { name: 'Submit' }).click();

  // Click a link
  await page.getByRole('link', { name: 'Learn more' }).click();

  // Find a heading
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();

  // Check a checkbox
  await page.getByRole('checkbox', { name: 'Accept terms' }).check();
});
```

2. **Using Text Locators:**
```typescript
test('find elements by text', async ({ page }) => {
  await page.goto('https://example.com');

  // Exact text match
  await page.getByText('Welcome back').click();

  // Partial text with regex
  await expect(page.getByText(/welcome/i)).toBeVisible();
});
```

3. **Using Label Locators:**
```typescript
test('fill form using label locators', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('Password').fill('secret123');
  await page.getByLabel('Remember me').check();
  await page.getByRole('button', { name: 'Log in' }).click();
});
```

---

### Lab 2: Advanced Locator Techniques (45 minutes)

**Task:** Master chaining, filtering, and combining locators

1. **Chaining Locators:**
```typescript
test('find nested elements', async ({ page }) => {
  await page.goto('https://example.com/products');

  // Find a specific product card and click its button
  const product = page.getByRole('article').filter({ hasText: 'Product 1' });
  await product.getByRole('button', { name: 'Add to cart' }).click();

  // Verify action
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

2. **Filtering Locators:**
```typescript
test('filter elements by criteria', async ({ page }) => {
  await page.goto('https://example.com/tasks');

  // Filter by text
  const activeTasks = page.getByRole('listitem').filter({ hasText: 'Active' });
  await expect(activeTasks).toHaveCount(3);

  // Filter by child elements
  const tasksWithDelete = page.getByRole('listitem').filter({
    has: page.getByRole('button', { name: 'Delete' })
  });
  await expect(tasksWithDelete).toHaveCount(5);

  // Filter by NOT having text
  const incompleteTasks = page.getByRole('listitem')
    .filter({ hasNotText: 'Completed' });
  await expect(incompleteTasks).toHaveCount(7);
});
```

3. **Combining Locators (AND/OR):**
```typescript
test('combine locators', async ({ page }) => {
  await page.goto('https://example.com');

  // AND - both conditions must match
  const subscribeButton = page.getByRole('button')
    .and(page.getByTitle('Subscribe'));
  await subscribeButton.click();

  // OR - either condition can match
  const newEmailButton = page.getByRole('button', { name: 'New' })
    .or(page.getByRole('button', { name: 'New email' }));
  await newEmailButton.click();
});
```

---

### Lab 3: Working with Lists (30 minutes)

**Task:** Handle lists and dynamic content

```typescript
test('work with lists', async ({ page }) => {
  await page.goto('https://example.com/items');

  // Count items
  await expect(page.getByRole('listitem')).toHaveCount(5);

  // Assert all text in order
  await expect(page.getByRole('listitem')).toHaveText([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ]);

  // Select first item
  await page.getByRole('listitem').first().click();

  // Select last item
  await page.getByRole('listitem').last().click();

  // Select third item (zero-indexed)
  await page.getByRole('listitem').nth(2).click();

  // Iterate through items
  const items = page.getByRole('listitem');
  const count = await items.count();

  for (let i = 0; i < count; i++) {
    const text = await items.nth(i).textContent();
    console.log(`Item ${i}: ${text}`);
  }
});
```

---

### Lab 4: Locator Strictness (20 minutes)

**Task:** Understand and handle locator strictness

```typescript
test('handle multiple matches', async ({ page }) => {
  await page.goto('https://example.com/products');

  // This throws if multiple buttons match (strict mode)
  // await page.getByRole('button').click(); // Error!

  // Solution 1: Be more specific
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Solution 2: Explicitly select first
  await page.getByRole('button').first().click();

  // Count works with multiple matches
  const buttonCount = await page.getByRole('button').count();
  console.log(`Found ${buttonCount} buttons`);

  // Filter to narrow down
  const deleteButtons = page.getByRole('button')
    .filter({ hasText: 'Delete' });
  await expect(deleteButtons).toHaveCount(3);
});
```

---

### Lab 5: Real-World Patterns (45 minutes)

**Task:** Apply locators to common UI patterns

1. **Login Form:**
```typescript
test('complete login flow', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

2. **Navigation:**
```typescript
test('navigate through site', async ({ page }) => {
  await page.goto('https://example.com');

  await page.getByRole('link', { name: 'Products' }).click();
  await expect(page.getByRole('heading', { name: 'Our Products' })).toBeVisible();

  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
});
```

3. **Shopping Cart:**
```typescript
test('add items to cart', async ({ page }) => {
  await page.goto('https://example.com/products');

  // Find laptop product and add to cart
  const laptop = page.getByRole('article').filter({ hasText: 'Laptop' });
  await laptop.getByRole('button', { name: 'Add to cart' }).click();

  // Verify cart count
  await expect(page.getByTestId('cart-count')).toHaveText('1');

  // Find phone product and add to cart
  const phone = page.getByRole('article').filter({ hasText: 'Phone' });
  await phone.getByRole('button', { name: 'Add to cart' }).click();

  // Verify cart count updated
  await expect(page.getByTestId('cart-count')).toHaveText('2');
});
```

4. **Complex Form:**
```typescript
test('fill multi-field form', async ({ page }) => {
  await page.goto('https://example.com/register');

  await page.getByLabel('First name').fill('John');
  await page.getByLabel('Last name').fill('Doe');
  await page.getByLabel('Email').fill('john.doe@example.com');
  await page.getByLabel('Phone').fill('123-456-7890');
  await page.getByLabel('Country').selectOption('USA');
  await page.getByRole('checkbox', { name: 'Subscribe to newsletter' }).check();
  await page.getByRole('checkbox', { name: 'Accept terms' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Registration successful')).toBeVisible();
});
```

---

### Lab 6: Auto-Retrying Assertions (30 minutes)

**Task:** Master visibility, state, and content assertions

1. **Visibility and State Assertions:**
```typescript
test('verify element visibility and state', async ({ page }) => {
  await page.goto('https://example.com');

  // Visibility assertions
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  await expect(page.getByText('Loading...')).toBeHidden();

  // State assertions
  await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Processing' })).toBeDisabled();
  await expect(page.getByLabel('Email')).toBeFocused();
});
```

2. **Content Assertions:**
```typescript
test('verify text and value content', async ({ page }) => {
  await page.goto('https://example.com/profile');

  // Text assertions
  await expect(page.getByRole('heading')).toHaveText('User Profile');
  await expect(page.getByTestId('status')).toContainText('Active');

  // Value assertions
  await expect(page.getByLabel('Username')).toHaveValue('john_doe');
  await expect(page.getByLabel('Bio')).not.toBeEmpty();

  // List text assertions
  await expect(page.getByRole('listitem')).toHaveText([
    'Home',
    'Profile',
    'Settings'
  ]);
});
```

3. **Attribute Assertions:**
```typescript
test('verify element attributes', async ({ page }) => {
  await page.goto('https://example.com');

  // Attribute value
  await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');

  // CSS properties
  await expect(page.getByRole('button')).toHaveCSS('background-color', 'rgb(0, 123, 255)');

  // Class and ID
  await expect(page.getByTestId('alert')).toHaveClass('success');
  await expect(page.getByTestId('alert')).toHaveClass(/alert-\w+/);
});
```

---

### Lab 7: Form and Page Assertions (30 minutes)

**Task:** Test forms, inputs, and page-level assertions

1. **Form Assertions:**
```typescript
test('validate form inputs', async ({ page }) => {
  await page.goto('https://example.com/register');

  // Fill form
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByRole('checkbox', { name: 'Accept terms' }).check();
  await page.getByLabel('Country').selectOption('USA');

  // Verify form state
  await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
  await expect(page.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
  await expect(page.getByLabel('Subscribe')).not.toBeChecked();
});
```

2. **Page Assertions:**
```typescript
test('verify page URL and title', async ({ page }) => {
  await page.goto('https://example.com');

  // URL assertions
  await expect(page).toHaveURL('https://example.com/');

  // Navigate
  await page.getByRole('link', { name: 'Products' }).click();

  // Verify navigation
  await expect(page).toHaveURL(/\/products/);
  await expect(page).toHaveTitle('Products - My Store');
  await expect(page).toHaveTitle(/Products/);
});
```

---

### Lab 8: Soft Assertions and Custom Messages (25 minutes)

**Task:** Use soft assertions and custom messages for better debugging

1. **Soft Assertions:**
```typescript
test('validate multiple UI elements', async ({ page }) => {
  await page.goto('https://example.com/dashboard');

  // All assertions will run even if some fail
  await expect.soft(page.getByRole('heading')).toHaveText('Dashboard');
  await expect.soft(page.getByTestId('user-name')).toContainText('John');
  await expect.soft(page.getByTestId('notifications')).toHaveCount(3);
  await expect.soft(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  // All failures reported at the end
});
```

2. **Custom Messages:**
```typescript
test('use custom messages for clarity', async ({ page }) => {
  await page.goto('https://example.com/cart');

  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  await expect(
    page.getByTestId('cart-count'),
    'Cart count should update after adding item'
  ).toHaveText('1');

  await expect(
    page.getByRole('alert'),
    'Success message should appear after adding to cart'
  ).toContainText('Item added');
});
```

---

### Lab 9: Polling and Timeout Configuration (20 minutes)

**Task:** Handle async operations and configure timeouts

1. **Polling Assertions:**
```typescript
test('poll for API status', async ({ page }) => {
  await page.goto('https://example.com/jobs');

  // Trigger long-running job
  await page.getByRole('button', { name: 'Start job' }).click();

  // Poll for completion
  await expect.poll(async () => {
    const status = await page.getByTestId('job-status').textContent();
    return status;
  }, {
    timeout: 30000,
    intervals: [1000, 2000, 5000]
  }).toBe('Completed');
});
```

2. **Custom Timeouts:**
```typescript
test('configure timeouts for slow operations', async ({ page }) => {
  await page.goto('https://example.com/reports');

  // Generate report
  await page.getByRole('button', { name: 'Generate Report' }).click();

  // Wait longer for slow operation
  await expect(
    page.getByText('Report ready')
  ).toBeVisible({ timeout: 60000 });

  // Fast timeout for cached data
  await expect(
    page.getByTestId('cached-data')
  ).toBeVisible({ timeout: 1000 });
});
```

---

### Lab 10: Real-World Assertion Patterns (30 minutes)

**Task:** Apply assertions to common testing scenarios

1. **Form Validation:**
```typescript
test('validate form errors', async ({ page }) => {
  await page.goto('https://example.com/login');

  // Submit empty form
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify error messages
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();
  await expect(page).toHaveURL('/login');

  // Fill invalid email
  await page.getByLabel('Email').fill('invalid-email');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Invalid email format')).toBeVisible();
});
```

2. **Loading States:**
```typescript
test('verify loading and content states', async ({ page }) => {
  await page.goto('https://example.com/data');

  // Loading state
  await expect(page.getByText('Loading...')).toBeVisible();

  // Content loads
  await expect(page.getByRole('table')).toBeVisible();

  // Loading disappears
  await expect(page.getByText('Loading...')).not.toBeVisible();

  // Verify data
  await expect(page.getByRole('row')).toHaveCount(11); // header + 10 rows
});
```

3. **Dynamic Updates:**
```typescript
test('verify dynamic content updates', async ({ page }) => {
  await page.goto('https://example.com/counter');

  // Initial state
  await expect(page.getByTestId('count')).toHaveText('0');

  // Increment
  await page.getByRole('button', { name: 'Increment' }).click();
  await expect(page.getByTestId('count')).toHaveText('1');

  // Multiple increments
  await page.getByRole('button', { name: 'Increment' }).click();
  await page.getByRole('button', { name: 'Increment' }).click();
  await expect(page.getByTestId('count')).toHaveText('3');
});
```

4. **Multi-Element Verification:**
```typescript
test('verify list of items', async ({ page }) => {
  await page.goto('https://example.com/todos');

  // Count assertions
  await expect(page.getByRole('listitem')).toHaveCount(5);

  // Text content in order
  await expect(page.getByRole('listitem')).toHaveText([
    'Buy groceries',
    'Walk the dog',
    'Read a book',
    'Write code',
    'Exercise'
  ]);

  // Individual item assertions
  await expect(page.getByRole('listitem').first()).toContainText('Buy groceries');
  await expect(page.getByRole('listitem').last()).toContainText('Exercise');

  // Filter and count
  const completed = page.getByRole('listitem').filter({ hasText: 'Completed' });
  await expect(completed).toHaveCount(2);
});
```

---

## ✅ Success Criteria

After completing this module, you should be able to:

**Locator Strategies:**
- [x] Understand how Playwright locators auto-wait and retry
- [x] Use role-based locators effectively
- [x] Apply text, label, and placeholder locators
- [x] Chain locators for nested elements
- [x] Filter locators by text and child elements
- [x] Combine locators with AND/OR operators
- [x] Work with lists using first, last, nth
- [x] Handle locator strictness appropriately
- [x] Avoid brittle CSS and XPath selectors

**Test Assertions:**
- [x] Use auto-retrying assertions for reliable tests
- [x] Apply visibility and state assertions
- [x] Verify content with text and value assertions
- [x] Test forms and inputs with appropriate assertions
- [x] Validate page URLs and titles
- [x] Use soft assertions for comprehensive validation
- [x] Configure custom timeouts for different scenarios
- [x] Apply polling assertions for async operations
- [x] Write accessible, resilient test automation

---

## 🎓 Quick Reference

### Locator Priority (Best to Worst)
```typescript
// 1. Role locators (best)
page.getByRole('button', { name: 'Submit' })

// 2. Text locators
page.getByText('Welcome')

// 3. Label locators
page.getByLabel('Email address')

// 4. Placeholder locators
page.getByPlaceholder('Enter email')

// 5. Alt text locators
page.getByAltText('Logo')

// 6. Title locators
page.getByTitle('Close')

// 7. Test ID locators
page.getByTestId('submit-btn')

// 8. CSS/XPath (avoid when possible)
page.locator('.submit-button')
```

### Chaining and Filtering
```typescript
// Chain locators
page.getByRole('article').getByRole('button')

// Filter by text
page.getByRole('listitem').filter({ hasText: 'Active' })

// Filter by child
page.getByRole('listitem').filter({
  has: page.getByRole('button')
})

// Combine with AND
page.getByRole('button').and(page.getByTitle('Submit'))

// Combine with OR
page.getByRole('button', { name: 'New' })
  .or(page.getByRole('button', { name: 'Create' }))
```

### Working with Lists
```typescript
// Count items
await page.getByRole('listitem').count()

// Select by position
page.getByRole('listitem').first()
page.getByRole('listitem').last()
page.getByRole('listitem').nth(2)

// Assert all text
await expect(page.getByRole('listitem')).toHaveText([...])
```

### Common Assertions (Auto-Retrying)

**Visibility and State:**
```typescript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()
await expect(element).toBeAttached()

// State
await expect(element).toBeEnabled()
await expect(element).toBeDisabled()
await expect(element).toBeFocused()
await expect(element).toBeEditable()
```

**Content:**
```typescript
// Text
await expect(element).toHaveText('exact text')
await expect(element).toContainText('partial')
await expect(element).toHaveText(/regex/)

// Value
await expect(input).toHaveValue('value')
await expect(input).toBeEmpty()

// Lists
await expect(items).toHaveText(['item1', 'item2'])
await expect(items).toHaveCount(5)
```

**Attributes:**
```typescript
// Attributes
await expect(link).toHaveAttribute('href', '/path')
await expect(element).toHaveClass('active')
await expect(element).toHaveCSS('color', 'rgb(0, 0, 0)')

// Forms
await expect(checkbox).toBeChecked()
await expect(checkbox).not.toBeChecked()
```

**Page:**
```typescript
// URL and Title
await expect(page).toHaveURL('https://example.com')
await expect(page).toHaveURL(/\/products/)
await expect(page).toHaveTitle('Page Title')
```

**Special:**
```typescript
// Soft assertions (continue on failure)
await expect.soft(element).toBeVisible()

// Polling
await expect.poll(async () => {
  return await getSomeValue()
}).toBe('expected')

// Custom timeout
await expect(element).toBeVisible({ timeout: 10000 })

// Negation
await expect(element).not.toBeVisible()
```

---

## 💡 Tips for Success

**Locator Best Practices:**
1. **Prioritize user-facing attributes** - Think like a user, not a developer
2. **Avoid positional selectors** - `.nth()` breaks when DOM order changes
3. **Use test IDs sparingly** - Only when role/text identification isn't feasible
4. **Never use CSS/XPath as first choice** - They create brittle tests
5. **Leverage filtering** - Use `.filter()` instead of complex selectors
6. **Chain for precision** - Combine locators to narrow scope
7. **Test accessibility** - Role-based locators encourage ARIA compliance
8. **Understand strictness** - Single-element actions fail on multiple matches
9. **Trust auto-waiting** - Locators handle dynamic content automatically
10. **Keep it simple** - Most specific locator wins

**Assertion Best Practices:**
1. **Use auto-retrying assertions** - They handle timing issues automatically
2. **Be specific with locators** - Combine good locators with good assertions
3. **Assert user-visible state** - Test what users see, not implementation details
4. **Choose appropriate assertion types** - Use `toContainText` for partial matches
5. **Avoid over-asserting** - Only verify what matters for the test
6. **Use custom messages** - Make failures easier to debug
7. **Leverage soft assertions wisely** - Good for comprehensive validation
8. **Configure timeouts appropriately** - Long for slow ops, short for fast ops
9. **Prefer `.not` over manual checks** - Use built-in negation
10. **Group related assertions** - Organize tests with clear arrange-act-assert

---

## 📖 Additional Resources

**Locator Resources:**
- [Locators Documentation](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locator API Reference](https://playwright.dev/docs/api/class-locator)
- [ARIA Roles Reference](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

**Assertion Resources:**
- [Assertions Documentation](https://playwright.dev/docs/test-assertions)
- [Auto-Retrying Assertions](https://playwright.dev/docs/test-assertions#auto-retrying-assertions)
- [Assertion API Reference](https://playwright.dev/docs/api/class-locatorassertions)
- [Page Assertions](https://playwright.dev/docs/api/class-pageassertions)
- [Generic Assertions](https://playwright.dev/docs/api/class-genericassertions)

---

## ❓ Common Issues and Solutions

### Issue: Locator matches multiple elements
**Solution:** Be more specific or use `.first()`:
```typescript
// Too broad
await page.getByRole('button').click(); // Error!

// Better - specific name
await page.getByRole('button', { name: 'Submit' }).click();

// Or explicitly select first
await page.getByRole('button').first().click();
```

### Issue: Element not found
**Solution:** Check your locator matches user-visible attributes:
```typescript
// Wrong - looking for internal value
await page.getByText('submit_btn'); // Not visible to user

// Right - looking for visible text
await page.getByRole('button', { name: 'Submit' });
```

### Issue: Test breaks when CSS changes
**Solution:** Switch to user-facing locators:
```typescript
// Brittle - tied to CSS structure
await page.locator('.header .nav .btn-primary').click();

// Resilient - based on user perception
await page.getByRole('button', { name: 'Sign up' }).click();
```

### Issue: Can't find element in Shadow DOM
**Solution:** Playwright handles Shadow DOM automatically (except XPath):
```typescript
// Works with Shadow DOM
await page.getByRole('button', { name: 'Submit' });

// Doesn't work with Shadow DOM
await page.locator('//button'); // XPath doesn't pierce shadow roots
```

---

## 🎉 Module Complete!

You now have a solid understanding of Playwright locator strategies and test assertions! You've learned:

**Locator Strategies:**
- How to use user-facing locators effectively
- Advanced techniques like chaining, filtering, and combining
- Best practices for resilient test automation
- How to avoid brittle CSS and XPath selectors

**Test Assertions:**
- Auto-retrying assertions and their benefits
- Visibility, state, and content assertions
- Form validation and page assertions
- Soft assertions and custom messages
- Polling and timeout configuration

## 🚀 Next Steps

1. **Practice** - Apply locators and assertions to your test projects
2. **Refactor** - Update existing tests to use better locators and auto-retrying assertions
3. **Accessibility** - Use role locators to improve app accessibility
4. **Reliability** - Replace manual waits with auto-retrying assertions
5. **Share** - Teach your team about locator and assertion best practices

---

**Ready to start?**
- Begin with locators: [01_locator_strategies.md](01_locator_strategies.md)
- Then learn assertions: [02_test_assertions.md](02_test_assertions.md)
