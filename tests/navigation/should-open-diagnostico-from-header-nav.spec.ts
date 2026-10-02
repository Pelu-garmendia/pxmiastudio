// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Navigation', () => {
  test('should open the Chequeo Digital from the header nav', async ({ page }) => {
    await page.locator('.nav').getByRole('link', { name: 'Chequeo' }).click();

    await expect(page).toHaveURL(/\/diagnostico\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('¿Qué tan digital es tu negocio?');
  });

  test('should keep the header nav inside the screen on phones', async ({ page }) => {
    for (const width of [320, 390, 480, 560, 700]) {
      await page.setViewportSize({ width, height: 800 });
      const fits = await page.evaluate(() => {
        const nav = document.querySelector('.nav')!;
        return nav.scrollWidth <= nav.clientWidth && document.documentElement.scrollWidth <= window.innerWidth;
      });
      expect(fits, `nav fits at ${width}px`).toBe(true);
    }
  });
});
