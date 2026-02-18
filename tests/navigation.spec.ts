import { test, expect } from '@playwright/test';

test('home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Riley Drake')).toBeVisible();
});
