// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Quote form', () => {
  test('should open whatsapp with the quote message', async ({ page }) => {
    // Answer wa.me locally so the test checks our URL without depending on
    // WhatsApp being reachable from the test machine.
    await page.context().route('https://wa.me/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<p>WhatsApp</p>' })
    );

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

    await expect.poll(() => popup.url()).toContain('https://wa.me/5491135943909');
    const text = new URL(popup.url()).searchParams.get('text');
    expect(text).toContain('Marketing');
    expect(text).toContain('Necesito campañas de Instagram y Google Ads.');
  });
});
