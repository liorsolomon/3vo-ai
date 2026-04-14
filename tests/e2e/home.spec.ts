import { test, expect } from '@playwright/test';

test.describe('3vo.ai homepage', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/3vo/i);
    // Hero headline visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('page has no broken internal links', async ({ page }) => {
    await page.goto('/');

    // Collect all internal anchor hrefs
    const links = await page.locator('a[href^="/"], a[href^="#"]').all();
    const hrefs = await Promise.all(links.map((l) => l.getAttribute('href')));

    for (const href of hrefs) {
      if (!href || href === '#' || href.startsWith('#')) continue;
      const response = await page.request.get(href);
      expect(response.status(), `Broken link: ${href}`).toBeLessThan(400);
    }
  });

  test('product card links are present and point to correct domains', async ({ page }) => {
    await page.goto('/');
    const productLinks = page.locator('a[href*="3vo.ai"]');
    await expect(productLinks.first()).toBeVisible();
  });
});

test.describe('Contact modal', () => {
  test('opens when contact button is clicked', async ({ page }) => {
    await page.goto('/');

    // Find and click the contact trigger button
    const contactBtn = page.locator('button', { hasText: /contact/i }).first();
    if (await contactBtn.isVisible()) {
      await contactBtn.click();
      // Modal should appear
      await expect(page.locator('h2', { hasText: /contact/i })).toBeVisible();
    }
  });

  test('contact form accepts input and shows success', async ({ page }) => {
    await page.goto('/');

    // Open modal
    const contactBtn = page.locator('button', { hasText: /contact/i }).first();
    if (!await contactBtn.isVisible()) {
      test.skip();
      return;
    }
    await contactBtn.click();

    // Fill in the form
    await page.fill('input[placeholder*="first" i], input[name*="first" i]', 'Test');
    await page.fill('input[placeholder*="last" i], input[name*="last" i]', 'User');
    await page.fill('textarea', 'This is a test message from Playwright.');

    // Submit
    await page.click('button[type="submit"], input[type="submit"]');

    // Success state should appear
    await expect(page.locator('text=/received|thank|sent/i')).toBeVisible({ timeout: 5_000 });
  });

  test('modal closes on Escape key', async ({ page }) => {
    await page.goto('/');

    const contactBtn = page.locator('button', { hasText: /contact/i }).first();
    if (!await contactBtn.isVisible()) {
      test.skip();
      return;
    }
    await contactBtn.click();
    await expect(page.locator('h2', { hasText: /contact/i })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('h2', { hasText: /contact/i })).not.toBeVisible();
  });
});
