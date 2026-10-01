// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Casos', () => {
  test('should show the Farmacia Garmendia case from the header nav', async ({ page }) => {
    // 1. Click the "Casos" nav link
    await page.locator('.nav').getByRole('link', { name: 'Casos' }).click();

    await expect(page).toHaveURL(/#casos$/);
    const panel = page.getByRole('dialog', { name: 'Casos' });
    await expect(panel.getByRole('heading', { name: 'Cómo digitalizamos una farmacia de barrio.' })).toBeVisible();
    await expect(panel.getByRole('listitem')).toHaveCount(5);
    await expect(panel.getByRole('link', { name: 'Ver la web de la farmacia' })).toHaveAttribute(
      'href',
      'https://farmagarmendia.netlify.app/',
    );

    // 2. "Quiero lo mismo para mi negocio" jumps to the quote panel
    await panel.getByRole('link', { name: 'Quiero lo mismo para mi negocio' }).click();
    await expect(page).toHaveURL(/#cotizar$/);
    await expect(page.getByRole('heading', { name: 'Cotizá tu servicio.' })).toBeVisible();
    await expect(panel).toBeHidden();
  });
});
