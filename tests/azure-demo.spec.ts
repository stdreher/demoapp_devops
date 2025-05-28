import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://black-island-016210910.6.azurestaticapps.net');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Vanilla JavaScript App");
});

test('get started link', async ({ page }) => {
  await page.goto('https://black-island-016210910.6.azurestaticapps.net');

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('h2', { name: '2. Ebene' })).toBeVisible();
});
