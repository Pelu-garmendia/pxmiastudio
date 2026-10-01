// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { DIAG_URL } from './helpers';

test.describe('Diagnóstico', () => {
  test('should show only the intro screen on load', async ({ page }) => {
    await page.goto(DIAG_URL);

    await expect(page).toHaveTitle('Diagnóstico Digital PXM');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('¿Qué tan digital es tu negocio?');
    await expect(page.getByRole('button', { name: 'Empezar el diagnóstico →' })).toBeVisible();

    // The other screens use the `hidden` attribute and must not leak through.
    await expect(page.locator('#s-data')).toBeHidden();
    await expect(page.locator('#s-q')).toBeHidden();
    await expect(page.locator('#s-res')).toBeHidden();
  });
});
