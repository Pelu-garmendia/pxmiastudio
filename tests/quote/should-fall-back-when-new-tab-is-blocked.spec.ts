// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Quote form', () => {
  test('should open whatsapp in the same tab when the new tab is blocked', async ({ page }) => {
    await page.context().route('https://wa.me/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<p>WhatsApp</p>' })
    );
    // Simulate a browser that blocks popups (e.g. Instagram's in-app browser).
    await page.evaluate(() => {
      window.open = () => null;
    });

    await page.locator('.nav').getByRole('link', { name: 'Cotización' }).click();
    await page.getByRole('radio', { name: 'Automatización' }).check();
    await page.getByLabel('Contanos tu proyecto').fill('Un bot de WhatsApp para turnos.');
    await page.getByRole('button', { name: 'Enviar cotización por WhatsApp' }).click();

    await expect(page).toHaveURL(/^https:\/\/wa\.me\/5491135943909\?text=/);
    const text = new URL(page.url()).searchParams.get('text');
    expect(text).toContain('Automatización');
    expect(text).toContain('Un bot de WhatsApp para turnos.');
  });
});
