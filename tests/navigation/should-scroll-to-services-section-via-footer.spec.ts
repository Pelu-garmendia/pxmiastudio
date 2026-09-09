// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Navigation', () => {
  test('should scroll to services section via footer', async ({ page }) => {
    // 1. Click the "Servicios" footer link
    await page.locator('.footer-links').getByRole('link', { name: 'Servicios' }).click();

    await expect(page).toHaveURL(/#servicios$/);
    await expect(
      page.getByRole('heading', {
        name: 'Todo lo que tu negocio necesita para crecer online.',
      })
    ).toBeVisible();
  });
});
