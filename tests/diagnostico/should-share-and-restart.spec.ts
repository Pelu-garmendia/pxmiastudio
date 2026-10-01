// spec: specs/pxm-studio.plan.md
import { test, expect } from '@playwright/test';
import { answerAll, startDiagnostico } from './helpers';

test.describe('Diagnóstico', () => {
  test('should copy a shareable result and restart the test', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await startDiagnostico(page, 'Otro');
    await answerAll(page, 'B');

    await page.getByRole('button', { name: 'Copiar resultado para compartir' }).click();
    await expect(page.locator('#toast')).toHaveText('Resultado copiado. Pegalo en tus historias o en un grupo.');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('Saqué 5/10 en el Diagnóstico Digital de PXM Studio');
    expect(copied).toContain('https://pxmiastudio.netlify.app/diagnostico/');

    await page.getByRole('button', { name: 'Hacer el test de nuevo' }).click();
    await expect(page.locator('#s-intro')).toBeVisible();
    await expect(page.locator('#s-res')).toBeHidden();
    await expect(page.locator('#toast')).toHaveText('');
  });
});
