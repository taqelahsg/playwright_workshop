# Module 8: Locator Strategies

**Duration:** 2-3 hours
**Level:** Intermediate
**Prerequisites:** Completed Modules 2-6

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:
- ✅ Understand how Playwright locators work and their auto-waiting behavior
- ✅ Use user-facing locators (role, text, label) effectively
- ✅ Apply locator best practices and prioritization
- ✅ Chain and filter locators for precise element targeting
- ✅ Work with lists and dynamic content
- ✅ Avoid brittle selectors (CSS, XPath)
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

## ✅ Success Criteria

After completing this module, you should be able to:
- [x] Understand how Playwright locators auto-wait and retry
- [x] Use role-based locators effectively
- [x] Apply text, label, and placeholder locators
- [x] Chain locators for nested elements
- [x] Filter locators by text and child elements
- [x] Combine locators with AND/OR operators
- [x] Work with lists using first, last, nth
- [x] Handle locator strictness appropriately
- [x] Avoid brittle CSS and XPath selectors
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

---

## 💡 Tips for Success

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

---

## 📖 Additional Resources

- [Locators Documentation](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locator API Reference](https://playwright.dev/docs/api/class-locator)
- [ARIA Roles Reference](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

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

You now have a solid understanding of Playwright locator strategies! You've learned:
- How to use user-facing locators effectively
- Advanced techniques like chaining, filtering, and combining
- Best practices for resilient test automation
- How to avoid brittle CSS and XPath selectors

## 🚀 Next Steps

1. **Practice** - Apply these locators to your test projects
2. **Refactor** - Update existing tests to use better locators
3. **Accessibility** - Use role locators to improve app accessibility
4. **Share** - Teach your team about locator best practices

---

**Ready to start? Open [01_locator_strategies.md](01_locator_strategies.md) to begin!**
