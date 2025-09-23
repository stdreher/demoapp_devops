import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8000');
  // Clear localStorage to start fresh
  await page.evaluate(() => localStorage.clear());
});

test.describe('Calendar functionality', () => {
  test('should display calendar when clicking Calendar tab', async ({ page }) => {
    // Click on Calendar tab
    await page.getByText('Calendar').click();
    
    // Verify calendar is displayed
    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
    await expect(page.getByText('September 2025')).toBeVisible();
    
    // Verify navigation buttons are present
    await expect(page.getByRole('button', { name: '< Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next >' })).toBeVisible();
  });

  test('should open modal when clicking on a day', async ({ page }) => {
    await page.getByText('Calendar').click();
    
    // Click on day 15
    await page.getByText('15', { exact: true }).click();
    
    // Verify modal is open
    await expect(page.getByRole('heading', { name: 'Add Entry' })).toBeVisible();
    await expect(page.getByText('September 15, 2025')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter your note or event here' })).toBeVisible();
  });

  test('should add entry and mark day in red', async ({ page }) => {
    await page.getByText('Calendar').click();
    
    // Click on day 15 and add entry
    await page.getByText('15', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Enter your note or event here' }).fill('Test meeting');
    await page.getByRole('button', { name: 'Save Entry' }).click();
    
    // Verify day 15 has the entry class (visual marking)
    const day15 = page.locator('.calendar-day').filter({ hasText: '15' }).first();
    await expect(day15).toHaveClass(/has-entry/);
  });

  test('should edit existing entry', async ({ page }) => {
    await page.getByText('Calendar').click();
    
    // Add initial entry
    await page.getByText('15', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Enter your note or event here' }).fill('Initial entry');
    await page.getByRole('button', { name: 'Save Entry' }).click();
    
    // Click day 15 again to edit
    await page.getByText('15', { exact: true }).click();
    
    // Verify edit mode
    await expect(page.getByRole('heading', { name: 'Edit Entry' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter your note or event here' })).toHaveValue('Initial entry');
    await expect(page.getByRole('button', { name: 'Delete Entry' })).toBeVisible();
  });

  test('should delete entry and remove visual marking', async ({ page }) => {
    await page.getByText('Calendar').click();
    
    // Add entry
    await page.getByText('15', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Enter your note or event here' }).fill('Test entry');
    await page.getByRole('button', { name: 'Save Entry' }).click();
    
    // Verify entry is marked
    const day15 = page.locator('.calendar-day').filter({ hasText: '15' }).first();
    await expect(day15).toHaveClass(/has-entry/);
    
    // Delete entry
    await page.getByText('15', { exact: true }).click();
    await page.getByRole('button', { name: 'Delete Entry' }).click();
    
    // Verify entry is no longer marked
    await expect(day15).not.toHaveClass(/has-entry/);
  });

  test('should navigate between months', async ({ page }) => {
    await page.getByText('Calendar').click();
    
    // Go to next month
    await page.getByRole('button', { name: 'Next >' }).click();
    await expect(page.getByText('October 2025')).toBeVisible();
    
    // Go back to previous month
    await page.getByRole('button', { name: '< Previous' }).click();
    await expect(page.getByText('September 2025')).toBeVisible();
  });

  test('should persist entries across page reloads', async ({ page }) => {
    await page.getByText('Calendar').click();
    
    // Add entry
    await page.getByText('15', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Enter your note or event here' }).fill('Persistent entry');
    await page.getByRole('button', { name: 'Save Entry' }).click();
    
    // Reload page
    await page.reload();
    await page.getByText('Calendar').click();
    
    // Verify entry persists
    const day15 = page.locator('.calendar-day').filter({ hasText: '15' }).first();
    await expect(day15).toHaveClass(/has-entry/);
    
    // Verify entry content
    await page.getByText('15', { exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Enter your note or event here' })).toHaveValue('Persistent entry');
  });
});