import { test, expect } from '@playwright/test';

test.describe('Main Workflow', () => {
  test('should create a new list and add a URL', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page.getByText('Create New List')).toBeVisible();
    
    // Fill in the list creation form
    const listTitle = `Test List ${Date.now()}`;
    const listDescription = 'This is a test list for Playwright automation';
    const customSlug = `test-list-${Date.now()}`;
    
    // Fill the title field using pressSequentially to trigger onChange
    await page.getByLabel('List Title').pressSequentially(listTitle);
    
    // Wait for the button to be enabled
    await expect(page.getByRole('button', { name: 'Create List' })).toBeEnabled();
    
    await page.getByLabel('Custom URL (Optional)').fill(customSlug);
    await page.getByLabel('Description (Optional)').fill(listDescription);
    
    // Submit the form
    await page.getByRole('button', { name: 'Create List' }).click();
    
    // Wait for navigation to the list page
    await page.waitForURL(`**/list/${customSlug}`);
    
    // Verify we're on the list page with the correct title
    await expect(page.getByRole('heading', { name: listTitle })).toBeVisible();
    await expect(page.getByText(listDescription)).toBeVisible();
    
    // Verify the initial state shows no links
    await expect(page.getByText('No links yet')).toBeVisible();
    await expect(page.getByText('Add your first link using the form above')).toBeVisible();
    await expect(page.getByText('0 links')).toBeVisible();
    
    // Add a URL to the list
    const testUrl = 'https://github.com/burkeholland/the-urlist-web';
    await page.getByPlaceholder('Enter a URL to add to your list').fill(testUrl);
    await page.getByRole('button', { name: 'Add Link' }).click();
    
    // Wait for the link to be added and verify it appears
    await expect(page.getByText('No links yet')).not.toBeVisible();
    await expect(page.getByText('1 link')).toBeVisible();
    
    // Check that the link is displayed with the correct title
    await expect(page.getByRole('link', { name: /GitHub - burkeholland\/the-urlist-web/ })).toBeVisible();
    
    // Verify the link has the correct attributes
    const linkElement = page.getByRole('link', { name: /GitHub - burkeholland\/the-urlist-web/ });
    await expect(linkElement).toHaveAttribute('href', testUrl);
    await expect(linkElement).toHaveAttribute('target', '_blank');
    await expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Verify the input field is cleared after adding
    await expect(page.getByPlaceholder('Enter a URL to add to your list')).toHaveValue('');
    
    // Add another URL to test multiple links
    const secondUrl = 'https://playwright.dev/';
    await page.getByPlaceholder('Enter a URL to add to your list').fill(secondUrl);
    await page.getByRole('button', { name: 'Add Link' }).click();
    
    // Verify both links are now displayed
    await expect(page.getByText('2 links')).toBeVisible();
    await expect(page.getByRole('link', { name: /GitHub - burkeholland\/the-urlist-web/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Playwright/ })).toBeVisible();
  });
});
