// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Hero', () => {
  test('should link to the Chequeo Digital from the hero', async ({ page }) => {
    await page.getByRole('link', { name: 'Hacé tu chequeo gratis' }).click();

    await expect(page).toHaveURL(/\/diagnostico\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('¿Qué tan digital es tu negocio?');
  });

  test('should open the quote panel from the hero', async ({ page }) => {
    await page.locator('.hero').getByRole('link', { name: 'Pedí tu cotización' }).click();

    await expect(page).toHaveURL(/#cotizar$/);
    await expect(page.getByRole('heading', { name: 'Cotizá tu servicio.' })).toBeVisible();
  });
});
