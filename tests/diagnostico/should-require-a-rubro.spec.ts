// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { DIAG_URL } from './helpers';

test.describe('Diagnóstico', () => {
  test('should require a rubro before starting the questions', async ({ page }) => {
    await page.goto(DIAG_URL);
    await page.getByRole('button', { name: 'Empezar el diagnóstico →' }).click();
    await expect(page.locator('#counter')).toHaveText('PASO INICIAL');

    await page.getByRole('button', { name: 'Siguiente →' }).click();

    await expect(page.locator('#type-hint')).toHaveText('Elegí tu rubro para seguir. Si no está, elegí Otro.');
    await expect(page.getByLabel('Rubro')).toBeFocused();
    await expect(page.locator('#s-q')).toBeHidden();

    // "Volver" goes back to the intro.
    await page.getByRole('button', { name: '← Volver' }).click();
    await expect(page.locator('#s-intro')).toBeVisible();
    await expect(page.locator('#counter')).toHaveText('DIAGNÓSTICO GRATIS');
  });
});
