// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Navigation', () => {
  test('should scroll to contact section via header nav', async ({ page }) => {
    // 1. Click the "Contacto" nav link
    await page.locator('.nav').getByRole('link', { name: 'Contacto' }).click();

    await expect(page).toHaveURL(/#contacto$/);
    await expect(
      page.getByRole('heading', { name: '¿Listo para hacer crecer tu negocio?' })
    ).toBeVisible();
  });
});
