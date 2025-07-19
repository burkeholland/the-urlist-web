# Playwright Testing Setup for The Urlist Web

This document describes how to set up and run end-to-end tests for The Urlist Web application using Playwright.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- The Urlist Web application running locally

## Installation

1. Install Playwright as a dev dependency:
```bash
npm install -D @playwright/test
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Base URL**: `http://localhost:4322` (matches the dev server)
- **Test Directory**: `./tests`
- **Browser**: Chromium (Desktop Chrome)
- **Workers**: 1 (serial execution to avoid conflicts)
- **Web Server**: Automatically starts `npm run dev` before running tests

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode
```bash
npm run test:e2e:ui
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test tests/main-workflow.spec.ts
```

### Run specific test case
```bash
npx playwright test tests/main-workflow.spec.ts -g "should create a new list and add a URL"
```

### Run tests with headed browser (visible)
```bash
npx playwright test --headed
```

## Test Structure

### Main Workflow Test (`tests/main-workflow.spec.ts`)

This test covers the core functionality of the application:

1. **Create New List**:
   - Navigate to homepage
   - Fill in list creation form (title, slug, description)
   - Submit form
   - Verify navigation to list page

2. **Add URLs to List**:
   - Add a URL using the form
   - Verify the URL appears in the list
   - Verify link metadata (title, description, image)
   - Add multiple URLs
   - Verify all URLs are displayed

### Test Features

- **Form Validation**: Tests that the "Create List" button is disabled until required fields are filled
- **URL Normalization**: Tests that protocol-less URLs (like `github.com`) are properly handled
- **Loading States**: Tests that loading indicators appear during form submission
- **Link Metadata**: Verifies that links display proper titles and descriptions fetched from the URL

## Key Testing Patterns

### 1. Form Interaction
```typescript
// Use pressSequentially to trigger onChange events properly
await page.getByLabel('List Title').pressSequentially(listTitle);

// Wait for button to be enabled
await expect(page.getByRole('button', { name: 'Create List' })).toBeEnabled();
```

### 2. Navigation Testing
```typescript
// Wait for URL pattern
await page.waitForURL(`**/list/${customSlug}`);

// Verify page elements
await expect(page.getByRole('heading', { name: listTitle })).toBeVisible();
```

### 3. Dynamic Content
```typescript
// Wait for dynamic content to load
await expect(page.getByText('1 link')).toBeVisible();

// Use regex patterns for flexible matching
await expect(page.getByRole('link', { name: /GitHub - burkeholland/ })).toBeVisible();
```

### 4. Link Verification
```typescript
// Verify link attributes
const linkElement = page.getByRole('link', { name: /GitHub/ });
await expect(linkElement).toHaveAttribute('href', testUrl);
await expect(linkElement).toHaveAttribute('target', '_blank');
await expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
```

## Common Issues and Solutions

### 1. Button Not Enabled
**Issue**: The "Create List" button remains disabled even after filling the form.
**Solution**: Use `pressSequentially()` instead of `fill()` to properly trigger React's onChange events.

### 2. Flaky Tests
**Issue**: Tests sometimes fail due to timing issues.
**Solution**: Use explicit waits with `await expect()` instead of timeouts.

### 3. Form Validation
**Issue**: Form validation state not updating properly.
**Solution**: Ensure form fields have proper labels and use proper Playwright selectors.

## Best Practices

1. **Use Semantic Selectors**: Prefer `getByRole()`, `getByLabel()`, `getByText()` over CSS selectors
2. **Explicit Waits**: Always use `await expect()` for assertions that depend on async operations
3. **Test Data**: Use timestamps or random data to avoid conflicts between test runs
4. **Error Handling**: Test both success and error scenarios
5. **Cleanup**: Tests should be independent and not rely on previous test state

## Debugging Tests

1. **Run with --headed**: See the browser actions
2. **Use --debug**: Step through tests interactively
3. **Check HTML Report**: View detailed test results and screenshots
4. **Use VS Code Extension**: Install Playwright extension for better debugging

## Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

The report includes:
- Test results and timing
- Screenshots on failure
- Network requests
- Console logs
- Trace files for debugging

## CI/CD Integration

For continuous integration:
- Tests run in headless mode by default
- Use `--reporter=github` for GitHub Actions
- Configure retries for flaky tests
- Store test artifacts (screenshots, videos) on failure
