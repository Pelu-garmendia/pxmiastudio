// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Quote form', () => {
  test('should open whatsapp with the quote message', async ({ page }) => {
    // 1. Navigate to the quote section via the header nav
    await page.locator('.nav').getByRole('link', { name: 'Cotización' }).click();

    // 2. Select "Marketing" as the service type
    await page.getByRole('radio', { name: 'Marketing' }).check();

    // 3. Fill in the project detail
    await page.getByLabel('Contanos tu proyecto').fill('Necesito campañas de Instagram y Google Ads.');

    // 4. Submit the form
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Enviar cotización por WhatsApp' }).click();
    const popup = await popupPromise;

    // wa.me redirects to api.whatsapp.com in a real browser, so match on the
    // phone number + prefilled text rather than the wa.me host. Use
    // URLSearchParams (not decodeURIComponent) since the redirect re-encodes
    // spaces as "+".
    await expect.poll(() => popup.url()).toContain('5491135943909');
    const text = new URL(popup.url()).searchParams.get('text');
    expect(text).toContain('Marketing');
    expect(text).toContain('Necesito campañas de Instagram y Google Ads.');
  });
});
