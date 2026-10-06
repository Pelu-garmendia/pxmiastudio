// spec: specs/pxm-studio.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';

test.describe('Casos', () => {
  test('should switch to the Keuken case', async ({ page }) => {
    await page.locator('.nav').getByRole('link', { name: 'Casos' }).click();
    const dialog = page.getByRole('dialog', { name: 'Casos' });

    // 1. Select the Keuken tab
    await dialog.getByRole('tab', { name: 'Keuken · Centro cultural' }).click();
    await expect(dialog.getByRole('tab', { name: 'Keuken · Centro cultural' })).toHaveAttribute('aria-selected', 'true');
    await expect(dialog.getByRole('tabpanel', { name: 'Farmacia Garmendia' })).toBeHidden();

    const panel = dialog.getByRole('tabpanel', { name: 'Keuken · Centro cultural' });
    await expect(
      panel.getByRole('heading', { name: 'Le hicimos el sistema de caja a un centro cultural en la Patagonia.' }),
    ).toBeVisible();
    await expect(panel.getByRole('img', { name: 'Centro Cultural Keuken Aonikenk' })).toBeVisible();
    await expect(panel.locator('.case-item')).toHaveCount(5);

    // Logo + one image per item, all loading.
    const images = panel.getByRole('img');
    await expect(images).toHaveCount(6);
    for (const img of await images.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }

    await expect(panel.getByRole('link', { name: 'Ver Keuken en Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/keukenaonikenk/',
    );

    // 2. The CTA opens the quote panel
    await panel.getByRole('link', { name: 'Quiero lo mismo para mi negocio' }).click();
    await expect(page).toHaveURL(/#cotizar$/);
    await expect(page.getByRole('heading', { name: 'Cotizá tu servicio.' })).toBeVisible();
  });

  test('should move between cases with the arrow keys', async ({ page }) => {
    await page.locator('.nav').getByRole('link', { name: 'Casos' }).click();
    const dialog = page.getByRole('dialog', { name: 'Casos' });

    await dialog.getByRole('tab', { name: 'Farmacia Garmendia' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(dialog.getByRole('tab', { name: 'Keuken · Centro cultural' })).toBeFocused();
    await expect(dialog.getByRole('tabpanel', { name: 'Keuken · Centro cultural' })).toBeVisible();

    await page.keyboard.press('ArrowRight');
    await expect(dialog.getByRole('tab', { name: 'Farmacia Garmendia' })).toBeFocused();
    await expect(dialog.getByRole('tabpanel', { name: 'Farmacia Garmendia' })).toBeVisible();
  });
});
