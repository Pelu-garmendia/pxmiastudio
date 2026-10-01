// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { startDiagnostico } from './helpers';

test.describe('Diagnóstico', () => {
  test('should keep the previous answer when going back', async ({ page }) => {
    await startDiagnostico(page, 'Ropa o accesorios');

    await page.locator('#q-opts .opt').nth(1).click();
    await expect(page.locator('#q-count')).toHaveText('02 / 11');

    await page.getByRole('button', { name: '← Anterior' }).click();
    await expect(page.locator('#q-count')).toHaveText('01 / 11');
    await expect(page.getByRole('radio', { checked: true })).toHaveText('BSolo con fotos en Instagram o estados');

    // Back from the first question returns to the data step.
    await page.getByRole('button', { name: '← Anterior' }).click();
    await expect(page.locator('#s-data')).toBeVisible();
  });

  test('should reset answers when the rubro changes', async ({ page }) => {
    await startDiagnostico(page, 'Ropa o accesorios');
    await page.locator('#q-opts .opt').nth(0).click();
    await expect(page.locator('#q-count')).toHaveText('02 / 11');
    await page.getByRole('button', { name: '← Anterior' }).click();
    await page.getByRole('button', { name: '← Anterior' }).click();

    await page.getByLabel('Rubro').selectOption({ label: 'Artista o banda' });
    await page.getByRole('button', { name: 'Siguiente →' }).click();

    await expect(page.locator('#q-count')).toHaveText('01 / 09');
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  });

  test('should not skip a question when an option is tapped twice quickly', async ({ page }) => {
    await startDiagnostico(page, 'Ropa o accesorios');

    // Double tap (common on phones) before the auto-advance fires.
    await page.locator('#q-opts .opt').nth(0).click();
    await page.locator('#q-opts .opt').nth(1).click();

    await expect(page.locator('#q-count')).toHaveText('02 / 11');
    await page.waitForTimeout(500);
    await expect(page.locator('#q-count')).toHaveText('02 / 11');
  });
});
