// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Casos', () => {
  test('should show the Farmacia Garmendia case from the header nav', async ({ page }) => {
    // 1. Click the "Casos" nav link
    await page.locator('.nav').getByRole('link', { name: 'Casos' }).click();

    await expect(page).toHaveURL(/#casos$/);
    const dialog = page.getByRole('dialog', { name: 'Casos' });
    // The farmacia is the case selected by default.
    await expect(dialog.getByRole('tab', { name: 'Farmacia Garmendia' })).toHaveAttribute('aria-selected', 'true');
    const panel = dialog.getByRole('tabpanel', { name: 'Farmacia Garmendia' });
    await expect(panel.getByRole('heading', { name: 'Cómo digitalizamos una farmacia de barrio.' })).toBeVisible();
    await expect(panel.locator('.case-item')).toHaveCount(5);
    // Every item is illustrated with its slide image.
    const images = panel.getByRole('img');
    await expect(images).toHaveCount(5);
    for (const img of await images.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
    await expect(panel.getByRole('link', { name: 'Ver la web de la farmacia' })).toHaveAttribute(
      'href',
      'https://farmagarmendia.netlify.app/',
    );

    // 2. "Quiero lo mismo para mi negocio" jumps to the quote panel
    await panel.getByRole('link', { name: 'Quiero lo mismo para mi negocio' }).click();
    await expect(page).toHaveURL(/#cotizar$/);
    await expect(page.getByRole('heading', { name: 'Cotizá tu servicio.' })).toBeVisible();
    await expect(dialog).toBeHidden();
  });
});
