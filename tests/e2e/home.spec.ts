import { test, expect } from '@playwright/test';

test.describe('3vo.ai homepage', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/3vo/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('page has no broken internal links', async ({ page }) => {
    await page.goto('/');
    const links = await page.locator('a[href^="/"]').all();
    const hrefs = await Promise.all(links.map((l) => l.getAttribute('href')));
    for (const href of hrefs) {
      if (!href) continue;
      const response = await page.request.get(href);
      expect(response.status(), `Broken link: ${href}`).toBeLessThan(400);
    }
  });

  test('product card links are present', async ({ page }) => {
    await page.goto('/');
    const productLinks = page.locator('a[href*="3vo.ai"]');
    await expect(productLinks.first()).toBeVisible();
  });
});

test.describe('Contact modal', () => {
  test('opens when contact button is clicked', async ({ page }) => {
    await page.goto('/');
    const contactBtn = page.locator('button', { hasText: /contact/i }).first();
    if (!await contactBtn.isVisible()) { test.skip(); return; }
    await contactBtn.click();
    await expect(page.locator('h2', { hasText: /contact/i })).toBeVisible();
  });

  test('contact form accepts input and shows success', async ({ page }) => {
    await page.goto('/');
    const contactBtn = page.locator('button', { hasText: /contact/i }).first();
    if (!await contactBtn.isVisible()) { test.skip(); return; }
    await contactBtn.click();

    // Fill form fields — labels vary, target by placeholder or input index
    const inputs = page.locator('input[type="text"], input:not([type="email"]):not([type="submit"])');
    const inputCount = await inputs.count();
    if (inputCount >= 1) await inputs.nth(0).fill('Test');
    if (inputCount >= 2) await inputs.nth(1).fill('User');

    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible()) {
      await textarea.fill('Playwright test message.');
    }

    await page.click('button[type="submit"], input[type="submit"]');

    // Success state: "MESSAGE RECEIVED"
    await expect(page.locator('text=/MESSAGE RECEIVED/i')).toBeVisible({ timeout: 5_000 });
  });

  test('modal closes on Escape key', async ({ page }) => {
    await page.goto('/');
    const contactBtn = page.locator('button', { hasText: /contact/i }).first();
    if (!await contactBtn.isVisible()) { test.skip(); return; }
    await contactBtn.click();
    await expect(page.locator('h2', { hasText: /contact/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('h2', { hasText: /contact/i })).not.toBeVisible();
  });
});
